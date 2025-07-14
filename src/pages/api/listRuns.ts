import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SEQERA_API_URL;
const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
const token = process.env.NEXT_PUBLIC_SEQERA_ACCESS_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    res.status(result.status).json(data?.workflows);
  } catch (error) {
    console.log("Error while fetching workflows list: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
