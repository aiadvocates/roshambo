import mlflow
import warnings
from pathlib import Path
from model import RoshamboModel
from data import RoshamboDataModule
from pytorch_lightning.utilities.cli import LightningCLI

class RoshamboCLI(LightningCLI):
    def after_fit(self):
        print('Saving model!')
        
        best_model = self.trainer.checkpoint_callback.best_model_path
        model = RoshamboModel.load_from_checkpoint(best_model)
        model_dir = Path(self.trainer.default_root_dir).resolve() / 'model'
        model_params, file_size = model.save(model_dir, self.datamodule.classes)
        mlflow.log_params({
          "param_size": "{:,}".format(model_params),
          "model_size": "{:,}".format(file_size),
          "model_type": model.model_type
        })
        
if __name__ == '__main__':
    warnings.filterwarnings("ignore")
    mlflow.pytorch.autolog()
    with mlflow.start_run() as run:
      cli = RoshamboCLI(RoshamboModel, RoshamboDataModule)
