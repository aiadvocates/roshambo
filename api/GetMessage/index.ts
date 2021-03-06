import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      message: "HELLO THERE 🤡",
    },
  };
};

export default httpTrigger;
