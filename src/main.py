from torch.utils import data
from model import RoshamboModel
from data import RoshamboDataModule
from pytorch_lightning import Trainer

def main():
    dm = RoshamboDataModule(data_dir='../data/images', batch_size=8)
    dm.setup()
    model = RoshamboModel(classes=len(dm.classes), lr=.01)

    trainer = Trainer(gpus=1)
    trainer.fit(model, dm)

if __name__ == '__main__':
    main()