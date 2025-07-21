import { WorkflowLaunchPayload } from "@/models/workflow";
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = process.env.SEQERA_API_URL!;
const WORKSPACE_ID = process.env.WORKSPACE_ID!;
const COMPUTE_ENV_ID = process.env.COMPUTE_ID!;
const WORK_DIR = process.env.WORK_DIR!;
const token = process.env.SEQERA_ACCESS_TOKEN!;

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { runName, pipeline, revision, paramsText, configProfiles } =
      req.body;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const launchPayload: WorkflowLaunchPayload = {
      launch: {
        computeEnvId: COMPUTE_ENV_ID,
        runName,
        pipeline,
        workDir: WORK_DIR,
        workspaceId: WORKSPACE_ID,
        revision,
        paramsText: JSON.stringify(paramsText),
        configProfiles,
        preRunScript: "module load nextflow",
        resume: false
      }
    };

    const request = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(launchPayload)
    };

    try {
      console.log("Request: ", request);
      const seqeraRes = await fetch(
        `${BASE_URL}/workflow/launch?workspaceId=${WORKSPACE_ID}`,
        request
      );

      const data = await seqeraRes.json();
      res.status(seqeraRes.status).send({ data });
    } catch (error: any) {
      res.status(500).send(error);
    }
  }
