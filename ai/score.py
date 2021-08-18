import os
import sys
import json
import time
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

session, transform, classes, input_name = None, None, None, None
logger = logging.getLogger()

def init():
    global session, transform, classes, input_name, logger
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

input = StandardPythonParameterType({
  'image': StandardPythonParameterType("http://path/to/image")
})
outputs = StandardPythonParameterType({
  'time': StandardPythonParameterType(0.157),
  'prediction': StandardPythonParameterType("paper"),
  'scores': StandardPythonParameterType({
    'none': StandardPythonParameterType(0.157),
    'paper': StandardPythonParameterType(0.157),
    'rock': StandardPythonParameterType(0.157),
    'scissors': StandardPythonParameterType(0.157)
  })
})
@input_schema('inputs', input)
@output_schema(outputs)
def run(inputs):
    global session, transform, classes, input_name, logger

    print('starting inference clock')
    prev_time = time.time()

    # input data
    print(f'loading post info {json.dumps(inputs)}')

    
    image_url = inputs['image']
    print(f'loading image {image_url}')
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
    v = transform(img)

    # predict with model
    print('pre-prediction')
    pred_onnx = session.run(None, {input_name: v.unsqueeze(0).numpy()})[0][0]
    print('prediction complete')

    current_time = time.time()
    print('stopping clock')
    inference_time = datetime.timedelta(seconds=current_time - prev_time)

    predictions = {}
    for i in range(len(classes)):
        predictions[classes[i]] = str(pred_onnx[i])

    print('preparing payload')
    payload = {
        'time': str(inference_time.total_seconds()),
        'prediction': classes[int(np.argmax(pred_onnx))],
        'scores': predictions
    }

    print(f'payload: {json.dumps(payload)}')
    print('inference complete')

    return payload


if __name__ == '__main__':
    init()
    rock = 'https://aiadvocate.z5.web.core.windows.net/rock.png'

    print('---------------------Inference with rock:')
    print(json.dumps(run({'image': rock}), indent=4))

    paper = 'https://aiadvocate.z5.web.core.windows.net/paper.png'

    print('---------------------Inference with paper:')
    print(json.dumps(run({'image': paper}), indent=4))

    scissors = 'https://aiadvocate.z5.web.core.windows.net/scissors.png'

    print('---------------------Inference with scissors:')
    print(json.dumps(run({'image': paper}), indent=4))