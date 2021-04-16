import os
import json
import torch
from pathlib import Path
from datetime import datetime
from model import RoshamboModel
from data import RoshamboDataModule
from pytorch_lightning import Trainer
from pytorch_lightning.callbacks import ModelCheckpoint, EarlyStopping

def main():
    dm = RoshamboDataModule(data_dir='../data/images', batch_size=8)
    dm.setup()
    model = RoshamboModel(classes=len(dm.classes), lr=.01)

    checkpoint_callback = ModelCheckpoint(
        monitor='val_acc',
        dirpath='../outputs/checkpoints',
        filename='roshambo-{epoch:02d}-{val_acc:.2f}',
        save_top_k=3,
        mode='min',
    )

    early_stop_callback = EarlyStopping(
        monitor='val_acc',
        min_delta=0.00,
        patience=3,
        verbose=False,
        mode='max'
    )

    trainer = Trainer(gpus=1,
                      default_root_dir='../outputs',
                      callbacks=[checkpoint_callback, early_stop_callback])

    trainer.fit(model, dm)
    model.save('../outputs/model', dm.classes)


if __name__ == '__main__':
    main()