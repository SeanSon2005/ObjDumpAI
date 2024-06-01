from typing import Any, Callable

import cv2
import os
import numpy as np
import torch
import torch.nn.functional as F
import torchvision.transforms.functional as Ft
from torch.utils.data import DataLoader, Dataset
from torch.utils.data.dataloader import default_collate
from torch.utils.data.sampler import SubsetRandomSampler
from torchvision import datasets, transforms

class CustomDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        images_path = os.path.join(data_dir,"images")
        images_list = os.listdir(images_path)
        labels_path = os.path.join(data_dir,"labels")
        labels_list = os.listdir(labels_path)
        images_np = np.zeros((len(images_list),640,640,3), dtype=np.float32)
        labels_np = []
        for index, name in enumerate(zip(images_list,labels_list)):
            image_name, label_name = name
            image = cv2.imread(os.path.join(images_path, image_name))
            label = np.loadtxt(os.path.join(labels_path, label_name),dtype=np.float32)
            square_img = cv2.resize(image,(640,640))
            images_np[index] = square_img
            labels_np.append(label)
            
        self.images = images_np
        self.labels = labels_np
        self.data_dir = data_dir
        self.image_transform = transform[0]
        self.label_transform = transform[1]

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()

        image = np.float32(self.images[idx])
        label = self.labels[idx]
        if self.label_transform:
            label = self.label_transform(label)
        if self.image_transform:
            image = self.image_transform(image)
        sample = (image, label)

        return sample

class BaseDataLoader(DataLoader):
    """Custom base class for all data loaders. Inherits from PyTorch DataLoader.

    Attributes:
        shuffle (bool): Whether to shuffle the data every epoch.
        n_samples (int): Total number of samples in the dataset.
        validation_split (int | float): Fraction or amount of the data to be
            used as validation data.
        train_sampler (Sampler): Sampler for the training data.
        valid_sampler (Sampler): Sampler for the validation data.
        init_kwargs (dict): Keyword arguments for the PyTorch DataLoader
            initialization.
    """

    def __init__(
        self,
        dataset: Any,
        batch_size: int,
        shuffle: bool,
        validation_split: int | float,
        num_workers: int,
        collate_fn: Callable = default_collate,
    ):
        self.shuffle = shuffle
        self.n_samples = len(dataset)
        self.validation_split = validation_split
        self.train_sampler, self.valid_sampler = self._split_sampler(
            self.validation_split
        )
        self.init_kwargs = {
            "dataset": dataset,
            "batch_size": batch_size,
            "shuffle": self.shuffle,
            "collate_fn": collate_fn,
            "num_workers": num_workers,
        }
        super().__init__(sampler=self.train_sampler, **self.init_kwargs)

    def _split_sampler(
        self, split: float | int
    ) -> tuple[SubsetRandomSampler, SubsetRandomSampler]:
        # no split performed
        if split == 0.0:
            return None, None

        idx_full = np.arange(self.n_samples)
        np.random.shuffle(idx_full)

        if isinstance(split, int):
            assert split > 0, "Validation set size should be at least 1."
            assert (
                split < self.n_samples
            ), "Validation set size should be at most equal to the number of samples."
            len_valid = split
        else:
            len_valid = int(self.n_samples * split)

        valid_idx = idx_full[0:len_valid]
        train_idx = np.delete(idx_full, np.arange(0, len_valid))

        train_sampler = SubsetRandomSampler(train_idx)
        valid_sampler = SubsetRandomSampler(valid_idx)

        # turn off shuffle option which is mutually exclusive with sampler
        self.shuffle = False
        self.n_samples = len(train_idx)

        return train_sampler, valid_sampler

    def split_validation(self):
        """Get the validation set if configured."""
        if self.valid_sampler is None:
            return None
        else:
            return DataLoader(sampler=self.valid_sampler, **self.init_kwargs)


class CustomDataLoader(BaseDataLoader):
    """Custom data loading class for any type of object detection models

    Attributes:
        mnist_img_size (int): The size of the MNIST images.
        dataset (Dataset): The MNIST dataset.
    """

    def __init__(
        self,
        data_dir: str,
        batch_size: int,
        shuffle: bool = True,
        validation_split: int | float = 0.0,
        num_workers: int = 1,
        training: bool = True,
    ):
        """Initializes the MnistDataLoader with the given parameters.

        The MNIST image data is transformed manually following the paper, in
        itself follows "No Routing Needed Between Capsules" by Byerly et al. The
        label data returned is one-hot encoded. Overall, the returned data will
        be in shape of (batch_size, 1, 28, 28) and (batch_size, 10).

        Args:
            data_dir (str): The directory where the MNIST data is located.
            batch_size (int): Number of samples per batch.
            shuffle (bool, optional): Whether to shuffle the data every epoch.
                Defaults to True.
            validation_split (int | float, optional): If float, represents the
                fraction of samples to be used for validation. If int, represents
                the exact number of samples to be used for validation. Defaults to 0.0.
            num_workers (int, optional): Number of subprocesses to use for data
                loading. Defaults to 1.
            training (bool, optional): Whether the data loader is for training
                data. Defaults to True.
        """
        self.mnist_img_size = 28
        image_transform = transforms.Compose(
            [
                transforms.ToTensor(),
                transforms.Lambda(self.random_color_shift),
            ]
        )
        label_transform = None

        self.dataset = CustomDataset(data_dir=data_dir, transform=(image_transform, label_transform))
        super().__init__(
            self.dataset, batch_size, shuffle, validation_split, num_workers
        )

    def random_color_shift(self, img: torch.Tensor) -> torch.Tensor:
        """Randomly shift the color of an images (different light filters)"""
        # random values for angle and decision
        rand_vals = torch.clamp(
            torch.normal(0, 0.33, size=(2,)), min=-0.9999, max=0.9999
        )

        if rand_vals[1] > 0:  # return original image
            return img

        else:  # return color shifted image
            shift_amount = rand_vals[0] * 40 # -40 < shift_amount < 40
            new_img = torch.clamp(
                torch.add(img, shift_amount), min=0,max=255
            ) # apply shift
            return new_img
