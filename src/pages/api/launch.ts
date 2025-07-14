import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SEQERA_API_URL;
const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
const token = process.env.NEXT_PUBLIC_SEQERA_ACCESS_TOKEN!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { workspaceId, computeEnvId, workDir, runName, pipeline } = req.body;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  
  const launchPayload = {
    launch: {
      computeEnvId,
      runName,
      pipeline,
      workDir,
      workspaceId,
      revision: "master"
    }
  };

  const request = {
  method: "POST",
  headers: myHeaders,
  body: JSON.stringify(launchPayload)
  }
  
  try {
    console.log("Request: ", request)
    const seqeraRes = await fetch(
      `${BASE_URL}/workflow/launch?workspaceId=${WORKSPACE_ID}`, request
    );
  
    const data = await seqeraRes.json();
  res.status(seqeraRes.status).send({ data })
  } catch (error: any) {
    res.status(500).send(error);
  }
}
