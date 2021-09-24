import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Tensor, InferenceSession } from "onnxruntime-node";
import { convertToTensor, ImageData } from "../shared/process"

const httpTrigger: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  const modelFile = context.executionContext.functionDirectory + "/model.onnx";
  const model = await InferenceSession.create(modelFile);
  const data = <ImageData>req.body
  const t = convertToTensor(data);
  
  const feeds: Record<string, Tensor> = {};
  feeds[model.inputNames[0]] = t;
  const outputData = await model.run(feeds);

  context.res = {
    body: {
      pred: outputData
    },
  };
};

export default httpTrigger;
