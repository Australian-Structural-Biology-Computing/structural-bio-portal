import { LaunchLogs } from "@/models/workflow";
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.SEQERA_API_URL;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const token = process.env.SEQERA_ACCESS_TOKEN!;

type ResponseData = {
    log: LaunchLogs | [];
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
        .json({ message: "Missing workflowId", log: [] });
  }

  const request = {
    method: "GET",
    headers: myHeaders
  };
  const fetchURL = `${BASE_URL}/workflow/${workflowId}/log?workspaceId=${WORKSPACE_ID}`;

  try {
    const result = await fetch(fetchURL, request);
    const data = await result.json();
    const launchLog = await data.log;
    res
      .status(result.status)
      .json({ message: "Got launch logs", log: launchLog });
  } catch (error) {
    console.log("Error while fetching launch logs: ", error);
    res.status(500).json({ message: "Internal server error", log: [] });
  }
}
