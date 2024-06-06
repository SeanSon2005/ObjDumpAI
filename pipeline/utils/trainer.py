from abc import abstractmethod
from typing import Callable

import torch
from torch.utils.data import DataLoader
from torchvision.utils import make_grid

from .config import Config
from .logger import MetricTracker, LiveWriter, get_logger
import os


class BaseTrainer:
    def __init__(
        self,
        config: Config,
        model: torch.nn.Module,
        optimizer: torch.optim.Optimizer,
        criterion: torch.nn.Module | Callable,
        metric_fns: list[torch.nn.Module | Callable],
    ):
        self.config = config
        cfg_trainer: dict = self.config["trainer"]

        # setup architecture
        self.model = model
        self.optimizer = optimizer
        self.criterion = criterion
        self.metric_fns = metric_fns
        self.n_epoch: int = cfg_trainer["epochs"]
        self.start_epoch = 1

        # setup logger and visualization writer instance
        self.logger = get_logger(
            name="trainer", verbosity=0
        )
        self.writer = LiveWriter(
            os.path.join(self.config["data_loader"]["args"]["data_dir"], "live_data"), self.logger
        )
        self.log_step: int = cfg_trainer["log_step"]
        self.save_period: int = cfg_trainer["save_period"]
        self.checkpoint_dir = config.save_dir

        # configuration to monitor model performance and save best
        self.monitor: str = cfg_trainer.get("monitor", "off")
        if self.monitor == "off":
            self.mnt_mode = "off"
            self.mnt_best = 0
        else:
            self.mnt_mode, self.mnt_metric = self.monitor.split()
            assert self.mnt_mode in [
                "min",
                "max",
            ], "Only support min and max monitor mode"
            self.mnt_best = float("inf") if self.mnt_mode == "min" else float("-inf")
            self.early_stop: int = cfg_trainer.get("early_stop", float("inf"))
            if self.early_stop < 0:
                self.early_stop = float("inf")

    @abstractmethod
    def _train_epoch(self, epoch: int) -> dict:
        """Abstract method for training the model for one epoch.

        Args:
            epoch (int): The current epoch number.

        Returns:
            dict: A dictionary containing logged information for this epoch.

        Raises:
            NotImplementedError: This is an abstract method that should be
                implemented by subclasses.
        """
        raise NotImplementedError

    def train(self) -> None:
        """Full model training logic for a specified number of epochs.

        Raises:
            KeyError: If the specified metric for monitoring is not found in the log.
        """
        not_improved_count = 0
        for epoch in range(self.start_epoch, self.n_epoch + 1):
            epoch_log = {"epoch": epoch}
            result = self._train_epoch(epoch)
            epoch_log.update(result)

            # print logged information to the screen
            for key, value in epoch_log.items():
                self.logger.info("   {:15s}: {}".format(str(key), value))

            # monitor best performance and perform early stopping
            best = False
            if self.monitor != "off":
                try:  # check improvement on the specified monitor metric
                    improved = (
                        self.mnt_mode == "min"
                        and epoch_log[self.mnt_metric] < self.mnt_best
                    ) or (
                        self.mnt_mode == "max"
                        and epoch_log[self.mnt_metric] > self.mnt_best
                    )
                except KeyError:
                    self.logger.warning(
                        "Warning: Metric '%s' is not found. Model performance monitoring is disabled.",
                        self.mnt_metric,
                    )
                    self.monitor = "off"
                    improved = False

                if improved:
                    self.mnt_best = epoch_log[self.mnt_metric]
                    not_improved_count = 0
                    best = True
                else:
                    not_improved_count += 1

                # early stopping
                if not_improved_count > self.early_stop:
                    self.logger.info(
                        "Validation performance didn't improve for %d epochs. Training stops.",
                        self.early_stop,
                    )
                    break

            # save model checkpoint
            if epoch % self.save_period == 0:
                self._save_checkpoint(epoch, save_best=best)

    def _save_checkpoint(self, epoch: int, save_best: bool = False) -> None:
        """Save the current model checkpoint.

        Args:
            epoch (int): The current epoch number.
            save_best (bool, optional): Whether to save this checkpoint as the
                best so far. Defaults to False.
        """
        arch = type(self.model).__name__
        state = {
            "arch": arch,
            "epoch": epoch,
            "state_dict": self.model.state_dict(),
            "optimizer": self.optimizer.state_dict(),
            "monitor_best": self.mnt_best,
            "config": self.config,
        }
        fname = str(self.checkpoint_dir / f"ep{epoch}.pth")
        torch.save(state, fname)
        self.logger.info("Checkpoint saved: %s ...", fname)

        if save_best:  # save as the best yet
            best_fname = str(self.checkpoint_dir / "model_best.pth")
            torch.save(state, best_fname)
            self.logger.info("Best checkpoint saved: %s ...", best_fname)


class YoloTrainer(BaseTrainer):
    def __init__(
        self,
        config: Config,
        device: torch.device,
        model: torch.nn.Module,
        optimizer: torch.optim.Optimizer,
        criterion: torch.nn.Module | Callable,
        metric_fns: list[torch.nn.Module | Callable],
        train_data_loader: DataLoader,
        valid_data_loader: DataLoader = None,
        lr_scheduler: torch.optim.lr_scheduler.LRScheduler = None,
    ):
        super().__init__(config, model, optimizer, criterion, metric_fns)
        self.config = config
        self.device = device
        self.lr_scheduler = lr_scheduler

        # data loader and metric configuration
        self.train_loader = train_data_loader
        self.valid_loader = valid_data_loader
        self.train_metrics = MetricTracker(
            "loss", *[m.__name__ for m in metric_fns], writer=self.writer
        )
        self.valid_metrics = MetricTracker(
            "loss", *[m.__name__ for m in metric_fns], writer=self.writer
        )
        self.n_batch = len(self.train_loader)

    def _train_epoch(self, epoch: int) -> dict:
        """Train the model for one epoch.

        Args:
            epoch (int): The current epoch number.

        Returns:
            dict: A dictionary containing logged information for this epoch.
                Valid log is included if a validation data loader is provided.
        """
        # Write current Epoch
        self.writer.update({"Epoch":epoch, "Total Batches":len(self.train_loader)})

        # set the model to training mode
        self.model.train() 
        self.train_metrics.reset()

        for batch_idx, (images, labels) in enumerate(self.train_loader):
            # configure data and optimizer
            batch = self._generate_batch(images, labels)
            self.optimizer.zero_grad()  # zero the gradients

            # forward and backward pass
            preds = self.model(batch)
            loss, loss_items = self.criterion(preds, batch)
            loss.backward()
            self.optimizer.step()

            # update tracker
            self.train_metrics.update("loss", loss.item())

            # log training information
            if batch_idx % self.log_step == 0 or batch_idx == len(self.train_loader):
                self.logger.debug(self._progress(epoch, batch_idx, loss.item()))
            
            # Write
            self.writer.update({"Training Loss":loss.item(), "Current Batch":batch_idx+1})

        epoch_log = self.train_metrics.result()

        # validate the model, if provided
        if self.valid_loader is not None:
            val_log = self._valid_epoch(epoch)
            # add validation metrics to epoch log
            epoch_log.update(**{"val_" + k: v for k, v in val_log.items()})

        # update learning rate
        if self.lr_scheduler is not None:
            self.lr_scheduler.step()

        return epoch_log

    def _valid_epoch(self, epoch: int) -> dict:
        """Validate the model for one epoch.

        Args:
            epoch (int): The current epoch number.

        Returns:
            dict: A dictionary containing logged information for this epoch.
        """
        self.writer.update({"Total Batches":len(self.valid_loader)})
        self.model.eval()  # set the model to evaluation mode
        self.valid_metrics.reset()

        with torch.no_grad():
            for batch_idx, (images, labels) in enumerate(self.valid_loader):
                # configure data and optimizer
                batch = self._generate_batch(images, labels)

                # # forward and backward pass
                pred = self.model(batch)
                loss, loss_items = self.criterion(pred, batch)

                # update tracker
                self.valid_metrics.update("loss", loss.item())

                # Write
                self.writer.update({"Validation Loss":loss.item(),"Current Batch":batch_idx+1})
                

        return self.valid_metrics.result()

    def _progress(self, epoch_idx: int, batch_idx: int, loss_value: float) -> str:
        """Return a string for logging the training progress."""
        # get amount of training samples
        if hasattr(self.train_loader, "n_samples"):
            current = batch_idx * self.train_loader.batch_size
            samples = self.train_loader.n_samples
        else:
            current = batch_idx
            samples = self.n_batch

        base = "Train Epoch: {:>{}}/{} [{:>{}}/{} ({:3.0f}%)], Loss: {:.6f}"
        return base.format(
            epoch_idx,
            len(str(self.n_epoch)),
            self.n_epoch,
            current,
            len(str(samples)),
            samples,
            100 * current / samples,
            loss_value,
        )

    def _generate_batch(self, images, labels) -> dict:
        """Put data into dict"""
        sizes = torch.tensor([len(sublist) for sublist in labels])
        batch_idx = torch.cat([torch.full((size,), idx, dtype=torch.int32) for idx, size in enumerate(sizes)]).to(self.device)

        print(labels.shape)
        cls = torch.tensor(labels[:,:,0]).view(-1,1).to(self.device)
        bboxes = torch.tensor(labels[:,:,1:]).view(-1,4).to(self.device)
        images = torch.tensor(images / 255).to(self.device)

        batch = {
            "batch_idx" : batch_idx,
            "img": images,
            "cls": cls,
            "bboxes": bboxes,
        }
        return batch
    
