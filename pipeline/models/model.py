import torch
import torch.nn as nn
from ultralytics import YOLO

class Yolov9c(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.model = YOLO('yolov9c.yaml')

    def forward(self, x):
        return self.model(x)
