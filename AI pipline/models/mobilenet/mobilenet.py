import torch
import torch.nn as nn

class MobileNet(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.model = torch.hub.load('pytorch/vision:v0.10.0', 'mobilenet_v2', pretrained=False)
    def forward(self, x):
        return self.model(x)