FROM mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.1-cudnn8-ubuntu18.04:20220815.v1
RUN python -m pip install --upgrade pip
RUN pip install \
    --extra-index-url https://download.pytorch.org/whl/cu116 \
    azureml-defaults \
    torch \
    torchvision \
    pandas \
    inference-schema \
    onnxruntime-gpu
    