import torch
import torch.nn as nn


class EfficientNet(nn.Module):
    def __init__(self) -> None:
        super().__init__()
        self.model = torch.hub.load(
            'NVIDIA/DeepLearningExamples:torchhub',
            'nvidia_efficientnet_widese_b0',
            pretrained=False)

    def forward(self, x):
        return self.model(x)
