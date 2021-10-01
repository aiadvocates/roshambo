import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Tensor, InferenceSession } from "onnxruntime-node";
import { convertToTensor } from "../shared/process"

const modelClasses = [
  "none",
  "paper",
  "rock",
  "scissors"
];

const httpTrigger: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  const modelFile = context.executionContext.functionDirectory + "/model.onnx";
  const model = await InferenceSession.create(modelFile);
  const data = req.body.data;
  const width = req.body.width;
  const height = req.body.height;
  const t = convertToTensor(data, height, width);
  
  const feeds: Record<string, Tensor> = {};
  feeds[model.inputNames[0]] = t;
  const outputData = await model.run(feeds);
  const preds = <Float32Array>outputData[model.outputNames[0]].data;
  
  const idx = preds.indexOf(Math.max(...preds));
  const probs = {}
  for(let i = 0; i< preds.length; i++) {
    probs[modelClasses[i]] = preds[i] * 100
  }

  context.res = {
    body: {
      prediction: modelClasses[idx],
      probabilities: probs
    },
  };
};

export default httpTrigger;
