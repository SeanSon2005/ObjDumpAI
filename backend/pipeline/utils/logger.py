import importlib
import logging
import logging.config
from datetime import datetime
from pathlib import Path
from typing import Any, Callable
import json
import pandas as pd
import os

LOG_LEVELS = {
    0: logging.DEBUG,
    1: logging.INFO,
    2: logging.WARNING,
    3: logging.ERROR,
}


class LiveWriter:
    """
    Handles Live Recording of Training Data
    """

    def __init__(self, update_path: str, logger: logging.Logger):
        self.info = {
            'Epoch': None, 
            'Current Batch': None, 
            'Total Batches': None, 
            'Training Loss': None,
            'Validation Loss': None, 
            'Metrics': None,
        }
        self.logger = logger
        self.update_path = update_path
    def open(self, open_path):
        try:
            with open(open_path, 'rb') as f:
                self.info = json.load(open(open_path))
        except:
            self.logger.warning("Could not open file: " + open_path)
        
    def update(self, load_dict: dict):
        for key, value in load_dict.items():
            if key in self.info.keys():
                self.info[key] = value
            else:
                self.logger.warning("Provided key not found in writer keys: " + key)
        with open(os.path.join(self.update_path,"live.json"), "w") as f: 
            json.dump(self.info, f)

class MetricTracker:
    """Class for tracking metrics during model training and evaluation.

    This class uses a pandas DataFrame to store the total, counts, and average
    for each metric. If a `TensorboardWriter` is provided, it will also logs the
    value to the tensorboard.

    Attributes:
        writer (TensorboardWriter): Tensorboard writer for logging metrics.
        _data (pd.DataFrame): DataFrame for tracking metrics.
    """

    def __init__(self, *keys: str, writer: LiveWriter = None):
        """Initialize instance for tracking metrics for a given set of keys.

        Args:
            *keys (str): Metrics keys to be tracked. Used as index in a
                DataFrame with columns "total", "counts", "average".
            writer (TensorboardWriter, optional): Used to log the metrics.
                Defaults to None.
        """
        self.writer = writer
        self._data = pd.DataFrame(index=keys, columns=["total", "counts", "average"])
        self.reset()

    def reset(self):
        """Reset all values in the DataFrame to 0."""
        for col in self._data.columns:
            self._data[col].values[:] = 0

    def update(self, key: str, value: float, n: int = 1):
        """Updates the data on a given key.

        Args:
            key (str): The key for which the metrics are updated.
            value (float): The value to add to the total for the key.
            n (int, optional): The count to add to the counts for the key.
                Defaults to 1.
        """
        self._data.loc[key, "total"] += value * n
        self._data.loc[key, "counts"] += n
        self._data.loc[key, "average"] = (
            self._data["total"][key] / self._data["counts"][key]
        )

        if self.writer:
            self.writer.update({"Metrics": value})

    def avg(self, key: str) -> float:
        """Returns the average for a given key."""
        return self._data["average"][key]

    def result(self) -> dict:
        """Returns a dictionary of averages for all keys."""
        return dict(self._data["average"])


def global_logger_setup(log_cfg: dict, log_dir: str | Path) -> None:
    """Setup global logging. All loggers will inherit this setup.

    Args:
        log_cfg (dict): The logging configuration dictionary.
        log_dir (str | Path): The directory to save the logs.
    """
    for _, handler in log_cfg["handlers"].items():
        if "filename" in handler:
            handler["filename"] = str(log_dir / handler["filename"])
    logging.config.dictConfig(log_cfg)


def get_logger(name: str, verbosity: int = 0) -> logging.Logger:
    assert (
        verbosity in LOG_LEVELS
    ), f"Verbosity option {verbosity} is out of range (0-3)"
    logger = logging.getLogger(name)
    logger.setLevel(LOG_LEVELS[verbosity])
    return logger