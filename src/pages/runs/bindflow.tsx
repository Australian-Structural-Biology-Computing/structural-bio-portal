"use client";

import { launchWorkflow } from "@/controllers/launchWorkflow";
import {
  WorkflowLaunchForm,
  WorkflowInputSchema,
  InputParams
} from "@/models/workflow";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID!;
const COMPUTE_ENV_ID = process.env.NEXT_PUBLIC_COMPUTE_ID!;
const WORK_DIR = process.env.NEXT_PUBLIC_WORK_DIR!;

export default function WorkflowLauncher() {
  const router = useRouter();
  const defaultForm: WorkflowLaunchForm = {
    pipeline: "https://github.com/nextflow-io/hello",
    workspaceId: WORKSPACE_ID,
    computeEnvId: COMPUTE_ENV_ID,
    workDir: WORK_DIR,
    runName: ""
  };

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [workflowID, setWorkflowId] = useState("");
  const [schema, setSchema] = useState<WorkflowInputSchema | null>(null);
  const [inputParams, setInputParams] = useState<InputParams[] | []>([]);

  // fetch input schema
  useEffect(() => {
    const fetchSchema = async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/Australian-Structural-Biology-Computing/bindflow/refs/heads/main/nextflow_schema.json"
      );
      const data = await res.json();
      const inputSchema: WorkflowInputSchema = data.$defs
        .input_output_options ?? { required: [], properties: [] };

      setSchema(inputSchema);
      const required: string[] = inputSchema?.required ?? [];
      const params: InputParams[] = Object.entries(inputSchema.properties).map(
        ([key, value]: [string, any]) => ({
          key,
          description: value?.description,
          format: value?.format,
          help_text: value?.help_text,
          pattern: value?.pattern,
          type: value?.type,
          required: required.includes(key)
        })
      );
      console.log(required);
      setInputParams(params);
    };
    fetchSchema();
  }, []);
  // handle submit job
  const handleClick = async () => {
    try {
      setStatus("loading");
      console.log("Form: ", defaultForm);
      const result = await launchWorkflow({
        ...defaultForm,
        runName: "hello-from-Anne"
      });
      console.log("Success: ", result);
      setWorkflowId(result);
      setStatus("done");
    } catch (error) {
      console.log("error: ", error);
      setStatus("error");
    }
  };
  return (
    <>
      <Button onClick={handleClick} disabled={status === "loading"}>
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
