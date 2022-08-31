FROM mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.1-cudnn8-ubuntu18.04:20220815.v1
RUN python -m pip install --upgrade pip
RUN pip install \
    --extra-index-url https://download.pytorch.org/whl/cu116 \
    torch \
    torchvision \
    torchaudio \
    mlflow \
    azureml-mlflow \
    jsonargparse[signatures] \
    pytorch-lightning[extra] \
    ipykernel \
    onnxruntime-gpu \
    inference-schema
    