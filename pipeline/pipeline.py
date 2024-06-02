import numpy as np
import torch

import models.losses as module_loss
import models.metrics as module_metric
import models.model as module_arch
import utils.data_loader as module_data
from utils.config import Config
from utils.trainer import YoloTrainer
from utils.logger import get_logger
from generator.dino import Generator

class Pipeline:
    def __init__(self):
        self.generator = Generator()
        self.logger = get_logger(
            name="program", verbosity=0
        )

    def generate_labels(self, queries: list[str]):
        self.generator.label(queries)

    def train(self, path_to_config = "data/config.yaml"):
        cfg = Config.load_config(path_to_config)
        # set seed
        seed = cfg["main"]["seed"]
        torch.manual_seed(seed)
        torch.backends.cudnn.deterministic = True
        torch.backends.cudnn.benchmark = False
        np.random.seed(seed)
        self.logger.info("Using seed    : %s", seed)

        # set device
        device = torch.device(
            "cuda" if cfg["main"]["cuda"] and torch.cuda.is_available() else "cpu"
        )
        self.logger.info("Using device  : %s", device)

        # setup data_loader instances
        train_data_loader = cfg.init_obj("data_loader", module_data)
        valid_data_loader = train_data_loader.split_validation()
        self.logger.info("Data loaded   : %s", type(train_data_loader).__name__)

        # build model architecture
        model = cfg.init_obj("arch", module_arch, cfg=cfg)
        model = model.to(device)
        self.logger.info("Model set up  : %s", type(model).__name__)

        # build optimizer
        trainable_params = model.parameters()
        optimizer = cfg.init_obj("optimizer", torch.optim, trainable_params)
        lr_scheduler = cfg.init_obj("lr_scheduler", torch.optim.lr_scheduler, optimizer)

        # get function handles of loss and metrics
        criterion = cfg.init_obj("loss", module_loss, model = model)
        self.logger.info("Using loss    : %s", type(criterion).__name__)
        metrics = [getattr(module_metric, met) for met in cfg["metrics"]]
        self.logger.info("Using metrics : %s", [met.__name__ for met in metrics])

        trainer = YoloTrainer(
            config=cfg,
            device=device,
            model=model,
            optimizer=optimizer,
            criterion=criterion,
            metric_fns=metrics,
            lr_scheduler=lr_scheduler,
            train_data_loader=train_data_loader,
            valid_data_loader=valid_data_loader,
        )
        trainer.train()

if __name__ == "__main__":
    test_pipeline = Pipeline()
    test_pipeline.generate_labels(queries=["car","traffic cone"])
    test_pipeline.train()