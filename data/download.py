import os
import uuid
import json
import shutil
import urllib.request as request
from azure.cognitiveservices.vision.customvision.training import CustomVisionTrainingClient
from azure.cognitiveservices.vision.customvision.prediction import CustomVisionPredictionClient
from azure.cognitiveservices.vision.customvision.training.models import ImageFileCreateBatch, ImageFileCreateEntry, Region
from msrest.authentication import ApiKeyCredentials

def main(secrets, directory):
    with open(secrets) as f:
        keys = json.load(f)

    print(keys.keys())

    projectid = keys['projectid']
    endpoint = keys['endpoint']
    key = keys['key']

    credentials = ApiKeyCredentials(in_headers={"Training-key": key})
    trainer = CustomVisionTrainingClient(endpoint, credentials)

    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

    tags = trainer.get_tags(project_id=projectid)
    for tag in tags:
        os.makedirs(os.path.join(directory, tag.name))

    skip = 0
    images = trainer.get_tagged_images(project_id=projectid, take=50, skip=skip)
    while(len(images) > 0):
        for img in images:
            new_image = os.path.join(directory, img.tags[0].tag_name, f'{str(uuid.uuid4()).lower()}.png')
            print(f'\rdownloading {img.original_image_uri} to {new_image}', end="")
            request.urlretrieve(url=img.original_image_uri, filename=new_image)
        skip += 50
        images = trainer.get_tagged_images(project_id=projectid, take=50, skip=skip)
    print('\nDone!')    


if __name__ == '__main__':
    main('secrets.json', 'rock-paper-scissor')