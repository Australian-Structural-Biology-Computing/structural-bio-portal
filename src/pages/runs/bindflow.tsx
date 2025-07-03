"use client";

import { launchWorkflow } from "@/controllers/launchWorkflow";
import { WorkflowLaunchForm } from "@/models/workflow";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";

const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID;
const COMPUTE_ENV_ID = process.env.NEXT_PUBLIC_COMPUTE_ID;
const WORK_DIR = process.env.NEXT_PUBLIC_WORK_DIR;

export default function WorkflowLauncher() {
  const router = useRouter();
  const defaultForm: WorkflowLaunchForm = {
    pipeline: "https://github.com/nextflow-io/hello",
    workspaceId: WORKSPACE_ID,
    computeEnvId: COMPUTE_ENV_ID,
    workDir: WORK_DIR,
    run_name: ""
  };

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [workflowID, setWorkflowId] = useState("");
  const handleClick = async () => {
    try {
      setStatus("loading");
      console.log("Form: ", defaultForm)
      const result = await launchWorkflow({
        ...defaultForm,
        run_name: "hello-from-Anne"
      });
      console.log("Success: ", result);
      setWorkflowId(result.data.workflowId)
      setStatus("done");
    } catch (error) {
      console.log("error: ", error);
      setStatus("error");
    }
  };
  return (
    <>
      <Button onClick={handleClick} disables={status === "loading"}>
        {status === "loading" ? (
          <CircularProgress size={20} />
        ) : (
          "Launch Workflow"
        )}
      </Button>
      {status === "done" && <Typography>Launched {workflowID}</Typography>}
      {status === "error" && <Typography color="error.main">Error</Typography>}
    </>
  );
}
