import torch.nn as nn
from ultralytics.utils.torch_utils import make_divisible
from ultralytics.nn.tasks import DetectionModel
from ultralytics.utils import DEFAULT_CFG_KEYS, DEFAULT_CFG_DICT
from utils.config import Config
from types import SimpleNamespace


class BaseModel(nn.Module):
    def __init__(self, model_name: str, cfg: Config) -> None:
        super().__init__()
        self.model_class = DetectionModel(cfg=model_name)
        self.model = self.model_class.model
        self.args = SimpleNamespace(**(cfg['loss']['test']))
    def forward(self, batch):
        return self.model_class.forward(batch['img'])
        
class Yolov9c(BaseModel):
    def __init__(self, cfg: Config) -> None:
        BaseModel.__init__(self, 'yolov9c.yaml', cfg)
    
class Yolov8n(BaseModel):
    def __init__(self, cfg: Config) -> None:
        BaseModel.__init__(self, 'yolov8n.yaml', cfg)

