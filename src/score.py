import os
import json
import time
import requests
import datetime
import numpy as np
from PIL import Image
from io import BytesIO
import onnxruntime as rt
from torchvision import transforms

session, transform, classes, input_name = None, None, None, None

def init():
    global session, transform, classes, input_name

    model_path = '../outputs'

    meta_file = os.path.join(model_path, 'model.meta')
    with open(meta_file, 'r') as f:
        model_meta = json.load(f)
    classes = model_meta['classes']
    session = rt.InferenceSession(os.path.join(model_path, 'model.onnx'))
    input_name = session.get_inputs()[0].name
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

def run(raw_data):
    prev_time = time.time()

    post = json.loads(raw_data)
    image_url = post['image']
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
    v = transform(img)
    pred_onnx = session.run(None, {input_name: v.unsqueeze(0).numpy()})[0][0]

    current_time = time.time()
    inference_time = datetime.timedelta(seconds=current_time - prev_time)

    predictions = {}
    for i in range(len(classes)):
        predictions[classes[i]] = str(pred_onnx[i])

    payload = {
        'time': str(inference_time.total_seconds()),
        'prediction': classes[int(np.argmax(pred_onnx))],
        'scores': predictions
    }

    #print('Input ({}), Prediction ({})'.format(post['image'], payload))

    return payload


if __name__ == '__main__':
    init()
    rock = 'http://localhost:8000/rock.png'

    print('---------------------Inference with rock:')
    print(json.dumps(run(json.dumps({'image': rock})), indent=4))

    paper = 'http://localhost:8000/paper.png'

    print('---------------------Inference with paper:')
    print(json.dumps(run(json.dumps({'image': paper})), indent=4))

    paper = 'http://localhost:8000/scissors.png'

    print('---------------------Inference with scissors:')
    print(json.dumps(run(json.dumps({'image': paper})), indent=4))