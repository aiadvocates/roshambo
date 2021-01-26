import json
import time
from azure.cognitiveservices.vision.customvision.training import CustomVisionTrainingClient
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from azure.cognitiveservices.vision.customvision.training.models import ImageFileCreateBatch, ImageFileCreateEntry, Region
from msrest.authentication import ApiKeyCredentials

def main(secrets):
    with open(secrets) as f:
        keys = json.load(f)

    print(keys.keys())

    credentials = ApiKeyCredentials(in_headers={"Training-key": keys['key']})
    trainer = CustomVisionTrainingClient(keys['enpoint'], credentials)
    images = trainer.get_tagged_images(keys['projectid'])
    q = 1

    


if __name__ == '__main__':
    main('secrets.json')