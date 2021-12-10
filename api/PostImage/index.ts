import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";


const inferenceApi = process.env["INFERENCE_ENDPOINT"];
const inferencekey = process.env["INFERENCE_KEY"];

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const response = await axios.post(inferenceApi, { 'image': req.body?.image }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${inferencekey}`
      }
    });
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response.data
    };
};

export default httpTrigger;