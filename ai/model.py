import os
import json
import torch
import mlflow
import torch.nn as nn
from typing import List
from pathlib import Path
import torch.optim as optim
from datetime import datetime
import pytorch_lightning as pl
from torchvision import models
import torch.nn.functional as F

class RoshamboModel(pl.LightningModule):
    def __init__(self, classes: int, lr: float):
        super().__init__()
        
        self.save_hyperparameters()
        self.classes = classes
        self.lr = lr
        self.model_type = "shufflenet_v2_x0_5"
        self.xfer = models.shufflenet_v2_x0_5(pretrained=True)
        self.fc1 = nn.Linear(1000, classes)

        self.param_size = 0

    def forward(self, x):
        x = F.relu(self.xfer(x))
        return F.softmax(self.fc1(x), dim=1)

    def __compute(self, batch):
        x, y = batch
        y_hat = self(x)
        
        # loss
        loss = F.binary_cross_entropy(y_hat, y)

        # accuracy
        _, preds = torch.max(y_hat, 1)
        _, truth = torch.max(y, 1)
        accuracy = torch.sum((preds == truth).float()).item() / len(x)

        return loss, accuracy

    def training_step(self, batch, batch_idx):
        loss, acc = self.__compute(batch)
        self.log('loss', loss, prog_bar=True)
        self.log('acc', acc, prog_bar=True)
        return loss

    def validation_step(self, batch, batch_idx):
        loss, acc = self.__compute(batch)
        self.log('val_loss', loss, prog_bar=True)
        self.log('val_acc', acc, prog_bar=True)

    def configure_optimizers(self):
        optimizer = optim.SGD(self.parameters(), lr=self.lr)
        scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)
        return [optimizer], [scheduler]
        
    def save(self, model_dir: Path, classes: List[str]):
        now = datetime.now()

        if not model_dir.exists():
            os.makedirs(str(model_dir))

        self.to_onnx(model_dir / 'model.onnx', 
                     torch.rand((1,3,224,224)), 
                     export_params=True)

        file_size = os.path.getsize(str(model_dir / 'model.onnx'))

        param_size = sum(p.numel() for p in self.parameters())

        with open(model_dir / 'meta.json', 'w') as f:
            f.write(json.dumps({ 
              'classes': classes,
              'model': self.model_type,
              'params': param_size,
              'size': file_size
            }, indent=4))

        return (param_size, file_size)
