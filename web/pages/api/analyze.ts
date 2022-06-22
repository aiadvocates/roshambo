import axios from "axios";
import { RestError } from "@azure/core-http";
import type { NextApiRequest, NextApiResponse } from "next";

const inferenceApi = process.env["INFERENCE_ENDPOINT"] || '';
const inferencekey = process.env["INFERENCE_KEY"] || '';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.post(inferenceApi, req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${inferencekey}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    const e = <RestError>error;
    res.status(200).json({
      error: {
        code: e.code,
        details: e.details,
        message: e.message,
        name: e.name,
        statusCode: e.statusCode,
      },
    });
  }
};
