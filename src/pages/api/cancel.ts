import type { NextApiRequest, NextApiResponse } from "next";
import { reportWebVitals } from "next/dist/build/templates/pages";

const BASE_URL = process.env.NEXT_PUBLIC_SEQERA_API_URL;
const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
const token = process.env.NEXT_PUBLIC_SEQERA_ACCESS_TOKEN!;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse)
 {
    const { workflowId } = req.body;

    if (!workflowId) {
      return res.status(400).json({ message: "Missing workflowId" });
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const request = {
      method: "POST",
      headers: myHeaders
    };

    const cancelURL = `${BASE_URL}/workflow/${workflowId}/cancel?workspaceId=${WORKSPACE_ID}`;

    try {
      console.log("Request: ", request);
      const result = await fetch(cancelURL, request);
      const data = result.json();
      res.status(result.status).send(data);
    } catch (error) {
      console.log("Error while canceling workflow: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
 }