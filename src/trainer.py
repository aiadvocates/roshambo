import mlflow
from pathlib import Path
from model import RoshamboModel
from data import RoshamboDataModule
from pytorch_lightning.utilities.cli import LightningCLI

class RoshamboCLI(LightningCLI):
    def before_instantiate_classes(self) -> None:
        mlflow.autolog()

    def after_fit(self):
        print('Saving model!')
        best_model = self.trainer.checkpoint_callback.best_model_path
        model = RoshamboModel.load_from_checkpoint(best_model)
        model_dir = Path(self.trainer.default_root_dir).resolve() / 'model'
        model.save(model_dir, self.datamodule.classes)

if __name__ == '__main__':
    RoshamboCLI(RoshamboModel, RoshamboDataModule)