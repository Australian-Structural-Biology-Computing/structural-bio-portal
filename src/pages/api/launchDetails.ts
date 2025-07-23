import { LaunchDetails } from "@/models/workflow";
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.SEQERA_API_URL;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const token = process.env.SEQERA_ACCESS_TOKEN!;

type ResponseData = {
  workflows: LaunchDetails | [];
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");

  const workflowId = req.query?.workflowId as string;

  if (!workflowId) {
    return res
      .status(400)
      .json({ message: "Missing workflowId", workflows: [] });
  }

  const request = {
    method: "GET",
    headers: myHeaders
  };
  const fetchURL = `${BASE_URL}/workflow/${workflowId}?workspaceId=${WORKSPACE_ID}`;

  try {
    const result = await fetch(fetchURL, request);
    const data = await result.json();
    const launchDetails = await data.workflow;
    console.log(launchDetails);
    res
      .status(result.status)
      .json({ message: "Got launch details", workflows: launchDetails });
  } catch (error) {
    console.log("Error while fetching launch details: ", error);
    res.status(500).json({ message: "Internal server error", workflows: [] });
  }
}
