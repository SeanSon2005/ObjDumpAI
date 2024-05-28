import pandas as pd
from datetime import datetime

def singleton(cls):
    return cls()

@singleton
class Logger:
    def __init__(self):
        self._train_data = pd.DataFrame(columns=["epoch", "train loss", "valid loss", "total", "counts"])
        self._log_data = []
        self.reset()

    def reset(self):
        for col in self._train_data.columns:
            self._train_data[col].values[:] = 0

    def update(self, key: str, value: float, n: int = 1):
        self._train_data.loc[key, "total"] += value * n
        self._train_data.loc[key, "counts"] += n

    def info(self, descriptor: str, log):
        time_text = datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
        message = time_text + " >> " + (descriptor % log)
        print(message)
        self._log_data.append(message)
