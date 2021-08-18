import math
from typing import Optional
import pytorch_lightning as pl
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, random_split

class RoshamboDataModule(pl.LightningDataModule):

    def __init__(self, data_dir: str = "path/to/dir", 
                       batch_size: int = 32,
                       train_split: float = .8):
        super().__init__()
        self.data_dir = data_dir
        self.batch_size = batch_size
        self.train_split = train_split  

    def setup(self, stage: Optional[str] = None):
        self.transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                 std=[0.229, 0.224, 0.225])
        ])

        self.raw_data = datasets.ImageFolder(self.data_dir, transform=self.transform)
        self.classes = self.raw_data.classes

        sz = len(self.raw_data)
        train_sz = math.floor(self.train_split * sz)
        val_sz = sz - train_sz

        self.train_dataset, self.val_dataset = random_split(self.raw_data, 
                                                [train_sz, val_sz])

    def train_dataloader(self):
        return DataLoader(self.train_dataset, batch_size=self.batch_size)

    def val_dataloader(self):
        return DataLoader(self.val_dataset, batch_size=self.batch_size)
