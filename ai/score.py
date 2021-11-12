import os
import sys
import json
import time
import base64
import logging
import requests
import datetime
import numpy as np
from PIL import Image
from io import BytesIO
from pathlib import Path
import onnxruntime as rt
from torchvision import transforms
from inference_schema.schema_decorators import input_schema, output_schema
from inference_schema.parameter_types.standard_py_parameter_type import StandardPythonParameterType

session, transform, classes, input_name, model_stamp = None, None, None, None, None
logger = logging.getLogger()

def init():
    global session, transform, classes, input_name, logger, model_stamp
    logger.info('Attempting to load model artifacts')

    if 'AZUREML_MODEL_DIR' in os.environ:
        logger.info('using AZUREML_MODEL_DIR')
        root_dir = Path(os.environ['AZUREML_MODEL_DIR']).resolve() / 'model'
    else:
        logger.info('using local')
        root_dir = Path('outputs/model').resolve()

    logger.info(f'using model path {root_dir}')    
    meta_file = root_dir / 'meta.json'
    model_file = root_dir / 'model.onnx'
    logger.info(f'metadata path: {meta_file}')
    logger.info(f'model path: {model_file}')

    logger.info('loading metadata')
    with open(meta_file, 'r') as f:
        model_meta = json.load(f)
    logger.info(f'metadata load complete: {model_meta}')

    classes = model_meta['classes']
    model_stamp = model_meta['timestamp']

    logger.info('loading model')
    session = rt.InferenceSession(str(model_file))
    input_name = session.get_inputs()[0].name
    logger.info(f'model load complete (entry: {input_name})')
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    logger.info(f'transforms initialized')
    logger.info(f'init complete!')

@input_schema('image', StandardPythonParameterType("https://aiadvocate.z5.web.core.windows.net/scissors.png"))
@output_schema(StandardPythonParameterType({
  'time': StandardPythonParameterType(0.060392),
  'prediction': StandardPythonParameterType("paper"),
  'scores': StandardPythonParameterType({
    'none': StandardPythonParameterType(0.20599432),
    'paper': StandardPythonParameterType(0.31392053),
    'rock': StandardPythonParameterType(0.2621823),
    'scissors': StandardPythonParameterType(0.21790285)
  }),
  'timestamp': StandardPythonParameterType(datetime.datetime.now().isoformat()),
  'model_update': StandardPythonParameterType(datetime.datetime.now().isoformat()),
  'message': StandardPythonParameterType("Success!")
}))
def run(image):
    global session, transform, classes, input_name, logger, model_stamp

    print('starting inference clock')
    prev_time = time.time()

    # process data
    try:
        if image.startswith('http'):
            print(f'loading web image {image}')
            response = requests.get(image)
            img = Image.open(BytesIO(response.content))
        elif image.startswith('data:image'):
            data = image.split(",")
            print(f'loading base64 image {data[0]}')
            b64image = base64.b64decode(data[1])
            img = Image.open(BytesIO(b64image))
        else:
            print(f'loading base64 image')
            b64image = base64.b64decode(image)
            img = Image.open(BytesIO(b64image))

        v = transform(img.convert('RGB'))

        # predict with model
        print('pre-prediction')
        pred_onnx = session.run(None, {input_name: v.unsqueeze(0).numpy()})[0][0]
        print('prediction complete')

        predictions = {}
        for i in range(len(classes)):
            predictions[classes[i]] = float(pred_onnx[i])

        print('preparing payload')
        payload = {
            'time': float(0),
            'prediction': classes[int(np.argmax(pred_onnx))],
            'scores': predictions,
            'timestamp': datetime.datetime.now().isoformat(),
            'model_update': model_stamp,
            'message': 'Success!'
        }

    except Exception as e:
        predictions = {}
        for i in range(len(classes)):
            predictions[classes[i]] = float(0)

        print('preparing payload')
        payload = {
            'time': float(0),
            'prediction': "none",
            'scores': predictions,
            'timestamp': datetime.datetime.now().isoformat(),
            'model_update': model_stamp,
            'message': f'{e}'
        }

    current_time = time.time()
    print('stopping clock')
    inference_time = datetime.timedelta(seconds=current_time - prev_time)
    payload['time'] = float(inference_time.total_seconds())

    print(f'payload: {json.dumps(payload)}')
    print('inference complete')

    return payload


if __name__ == '__main__':
    init()
    def inf(uri, truth):
        print(f'---->Inference with {truth}:')
        o = run(uri)
        print(json.dumps(o, indent=4))
        print(f'---->End Inference with [{truth}] => [{o["prediction"]}]')

    inf('https://aiadvocate.z5.web.core.windows.net/rock.png', 'rock')
    inf('https://aiadvocate.z5.web.core.windows.net/paper.png', 'paper')
    inf('https://aiadvocate.z5.web.core.windows.net/scissors.png', 'scissors')   
    inf('bad_uri', 'Bad Uri')

    with open('testimage.txt', 'r') as f:
        img = f.read()
        inf(img, 'rock')


    with open('fullimage.txt', 'r') as f:
        img = f.read()
        inf(img, 'none')
