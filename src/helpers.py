import os
import torch
from torch import nn
from pathlib import Path
from functools import wraps
from torch import optim
from torch.utils.data import dataloader
from torch.optim.optimizer import Optimizer

###################################################################
# Helpers                                                         #
###################################################################
def info(msg, char = "#", width = 75):
    print("")
    print(char * width)
    print(char + "   %0*s" % ((-1*width)+5, msg) + char)
    print(char * width)

def check_dir(path, check=False):
    if check:
        assert os.path.exists(path), '{} does not exist!'.format(path)
    else:
        if not os.path.exists(path):
            os.makedirs(path)
        return Path(path).resolve()


def batch_logger(f):
    @wraps(f)
    def log(X: torch.Tensor, Y: torch.Tensor, epoch: int, batch_size: int, total_size: int, model: nn.Module, cost: nn.Module, optimizer: Optimizer = None):
        accuracy, loss = f(X, Y, epoch, batch_size, total_size, model, cost, optimizer)
        if optimizer != None:
            print(f'\rloss: {loss:>7f} [{epoch*batch_size+len(X):>4d} /{total_size:>4d}]', end="")
        return accuracy, loss
    return log
        
def epoch_logger(f):
    @wraps(f)
    def log(dataloader: dataloader, model: nn.Module, cost: nn.Module, optimizer: Optimizer = None, device:str='cpu'):
        epoch_accuracy, epoch_loss = f(dataloader, model, cost, optimizer, device)
        phase = '\n'+'Train'.rjust(8) if optimizer != None else 'Val'.rjust(8)
        print(f'{phase} -> Accuracy: {epoch_accuracy*100:>0.1f}%, Avg Loss: {epoch_loss:>8f}')
        return epoch_accuracy, epoch_loss
    return log

def main_logger(f):
    wraps(f)
    def log(*args, **kwargs):
        global run
        info('Setup')

        output_path: Path = None
        for k, v in kwargs.items():
            print(f'{k.rjust(10)} => {v}')
            if k == 'output_dir':
                output_path = v

        # run 
        f(*args, **kwargs)

    return log
