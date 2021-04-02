import torch
import torch.nn as nn
import torch.optim as optim
import pytorch_lightning as pl
from torchvision import models
import torch.nn.functional as F

class RoshamboModel(pl.LightningModule):
    def __init__(self, classes: int, lr: float):
        super().__init__()
        self.classes = classes
        self.lr = lr
        self.xfer = models.resnet18(pretrained=True)
        self.fc1 = nn.Linear(1000, 256)
        self.fc2 = nn.Linear(256, classes)

    def forward(self, x):
        x = F.relu(self.xfer(x))
        x = F.relu(self.fc1(x))
        return F.softmax(self.fc2(x), dim=1)

    def __compute(self, batch):
        x, y = batch
        y_hat = self(x)
        # loss
        loss = F.cross_entropy(y_hat, y)

        # accuracy
        _, preds = torch.max(y_hat, 1)
        accuracy = torch.sum((preds == y).float()).item() / len(x)

        return loss, accuracy


    def training_step(self, batch, batch_idx):
        loss, acc = self.__compute(batch)
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
