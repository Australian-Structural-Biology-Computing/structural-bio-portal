import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SEQERA_API_URL;
const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
const token = process.env.NEXT_PUBLIC_SEQERA_ACCESS_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const workflowId = req.body;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  const request = {
    method: "POST",
    header: myHeaders
  };

  try {
    console.log("Request: ", request);
    const result = await fetch(
      `${BASE_URL}/workflow/:${workflowId}/cancel?workspaceId=${WORKSPACE_ID}`,
      request
    );
    const data = await result.json();
    res.status(result.status).send({ data });
  } catch (error) {
    res.status(500).send(error);
  }
}
