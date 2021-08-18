import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Tensor, InferenceSession } from "onnxruntime-node";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  
  const model = context.executionContext.functionDirectory + "/model.onnx";
  const session = await InferenceSession.create(model);
  const input = session.inputNames[0]

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      message: "HELLO THERE 🤡",
    },
  };
};

export default httpTrigger;
