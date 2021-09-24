FROM mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.0.3-cudnn8-ubuntu18.04
COPY conda.yml ./
RUN conda env update -n base --file conda.yml