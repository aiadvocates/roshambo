import os
import json
import torch
from pathlib import Path
from datetime import datetime
from model import RoshamboModel
from data import RoshamboDataModule
from pytorch_lightning import Trainer
from pytorch_lightning.utilities.cli import LightningCLI
from pytorch_lightning.callbacks import ModelCheckpoint, EarlyStopping

class RoshamboCLI(LightningCLI):
    def after_fit(self):
        print('Saving model!')
        self.model.save('../outputs/model', self.datamodule.classes)

if __name__ == '__main__':
    RoshamboCLI(RoshamboModel, RoshamboDataModule)