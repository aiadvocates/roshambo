import os
import json
import torch
import argparse
import torch.nn as nn
from typing import Tuple
import torch.onnx as onnx
import torch.optim as optim
from torch.optim import lr_scheduler
from torch.utils.data import DataLoader
from torch.optim.optimizer import Optimizer
from torchvision import datasets, transforms, models
from helpers import info, check_dir, batch_logger, epoch_logger, main_logger

###################################################################
# batch/epoch                                                     #
###################################################################
@batch_logger
def batch(X: torch.Tensor, 
          Y: torch.Tensor, 
          epoch: int, 
          batch_size: int, 
          total_size: int,
          model: nn.Module, 
          cost: nn.Module, 
          optimizer: Optimizer = None) -> Tuple[float, float]:
    """
    Run a single batch. If no optimizer, assume validation
    """
    if optimizer != None:
        # zero out gradient
        optimizer.zero_grad()

    with torch.set_grad_enabled(optimizer != None):
        # execute model
        outputs = model(X)
        # find predictions
        _, preds = torch.max(outputs, 1)
        # loss function
        loss = cost(outputs, Y)

        if optimizer != None:
            # compute gradients
            loss.backward()
            # adjust parameters
            optimizer.step()

    accuracy = (preds == Y).float().sum().item()

    # return accuracy, avg loss
    return accuracy, loss.item() / len(X)

@epoch_logger
def epoch(dataloader: DataLoader, model: nn.Module, cost: nn.Module, optimizer: Optimizer = None, device:str='cpu') -> Tuple[float, float]:
    """
    run over data in dataloader
    """
    total_size = len(dataloader.dataset)
    epoch_accuracy, epoch_loss = 0, 0
    for e, (X, Y) in enumerate(dataloader):
        X, Y = X.to(device), Y.to(device)
        accuracy, loss = batch(X, Y, e, dataloader.batch_size, total_size, model, cost, optimizer)
        epoch_accuracy += accuracy
        epoch_loss += loss

    epoch_accuracy /= total_size
    epoch_loss /= total_size
    return epoch_accuracy, epoch_loss

def save(model: nn.Module, path: str, name: str, device: str='cpu') -> str:
    """
    Model saving
    """
    onnx_file = path.joinpath(f'{name}.onnx').resolve()
    pth_file = path.joinpath(f'{name}.pth').resolve()
    
    # create dummy variable to traverse graph
    x = torch.randint(255, (1, 3, 224, 224), dtype=torch.float).to(device)
    onnx.export(model, x, onnx_file)
    
    print(f'=> Saved onnx model to {onnx_file}')

    # saving PyTorch Model Dictionary
    torch.save(model.state_dict(), pth_file)
    print(f'=> Saved PyTorch Model to {pth_file}')

###################################################################
# Main Training Loop                                              #
###################################################################
@main_logger
def main(data_dir='data', output_dir='outputs', batch_size=4, epochs=25, lr=0.001, 
         device:str='CPU', name='foodai', description='none'):
    """
    Main training code
    """
   
    info(f'Initialization (using {device})')

    # get training data (transform, DataSet, DataLoader)
    train_transforms = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    train_dataset = datasets.ImageFolder(os.path.join(data_dir, 'train'), train_transforms)
    train_dataloader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=1)
    classes = train_dataset.classes
    with open('../outputs/model.meta', 'w') as f:
        f.write(json.dumps({ 'classes': classes}, indent=4))


    # get validation data (transform DataSet, DataLoader)
    val_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    val_dataset = datasets.ImageFolder(os.path.join(data_dir, 'val'), val_transforms)
    val_dataloader = DataLoader(val_dataset, batch_size=batch_size, shuffle=True, num_workers=1)

    # build model
    print(f'Building Model (transfer learning using resnet50)')
    
    model = nn.Sequential(
        models.resnet18(pretrained=True),
        nn.ReLU(),
        nn.Linear(1000, 256),
        nn.ReLU(),
        nn.Linear(256, len(classes)),
        nn.Softmax(dim=-1)
    )
    model = model.to(device)
    print(model)

    # cost, optimizer, lr scheduler (for backoff)
    cost = nn.CrossEntropyLoss()
    optimizer = optim.SGD(model.parameters(), lr=lr)
    lr_backoff = lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)

    # optimization loop
    val_acc, val_loss = 0, 100000
    best_acc = 0
    for e in range(epochs):
        info(f'Epoch {e+1}, Learning Rate -> {lr_backoff.get_last_lr()}')
        # train
        _, _ = epoch(train_dataloader, model, cost, optimizer, device)

        # val
        val_acc, val_loss = epoch(val_dataloader, model, cost, device=device)

        # save
        save(model, output_dir, f'model_{val_acc:.3f}{val_loss:.3f}', device)
        if val_acc > best_acc:
            best_acc = val_acc
            print('\nFound better model!')
            save(model, output_dir, 'model', device)

        lr_backoff.step()        

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Hot Dog vs Pizza')
    parser.add_argument('-d', '--data', help='directory to training and test data', default='../data')
    parser.add_argument('-o', '--output', help='output directory', default='../outputs')
    parser.add_argument('-n', '--name', help='experiment/model name', default='roshambo')
    parser.add_argument('-c', '--description', help='model description', default='Roshambo sign classification')
    
    parser.add_argument('-e', '--epochs', help='number of epochs', default=25, type=int)
    parser.add_argument('-b', '--batch', help='batch size', default=4, type=int)
    parser.add_argument('-l', '--lr', help='learning rate', default=0.01, type=float)


    args = parser.parse_args()

    # enforce folder locatations
    args.data = check_dir(args.data).resolve()
    args.outputs = check_dir(args.output).resolve()

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    main(data_dir=args.data, output_dir=args.outputs, 
         batch_size=args.batch, epochs=args.epochs, lr=args.lr, 
         device=device, name=args.name, description=args.description)