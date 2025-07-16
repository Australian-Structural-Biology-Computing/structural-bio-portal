import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.SEQERA_API_URL;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const token = process.env.SEQERA_ACCESS_TOKEN!;
type ResponseData = {
  message: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
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
  console.log("Request: ", cancelURL);

  try {
    const result = await fetch(cancelURL, request);
    res
      .status(result.status)
      .json({ message: `Canceled the workflow id: ${workflowId}` });
  } catch (error) {
    console.log("Error while canceling workflow: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
