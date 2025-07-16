import { RawRunInfo } from "@/models/workflow";
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.SEQERA_API_URL;
const WORKSPACE_ID = process.env.WORKSPACE_ID;
const token = process.env.SEQERA_ACCESS_TOKEN!;

type ResponseData = {
  workflows: RawRunInfo[];
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

  const request = {
    method: "GET",
    headers: myHeaders
  };
  const listRunsURL = `${BASE_URL}/workflow?workspaceId=${WORKSPACE_ID}`;

  try {
    console.log("Request: ", request);
    const result = await fetch(listRunsURL, request);
    const data = await result.json();
    const allRuns: RawRunInfo[] = data?.workflows;
    res
      .status(result.status)
      .json({ message: "Got all runs info", workflows: allRuns });
  } catch (error) {
    console.log("Error while fetching workflows list: ", error);
    res.status(500).json({ message: "Internal server error", workflows: [] });
  }
}
