"use client";

import { launchWorkflow } from "@/controllers/launchWorkflow";
import {
  WorkflowLaunchForm,
  WorkflowInputSchema,
  InputParams
} from "@/models/workflow";
import { Button, Checkbox, FormControlLabel, InputAdornment, MenuItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FTextField from "@/components/form/FTextField";
import FormProvider from "@/components/form/FormProvider";
import { useForm } from "react-hook-form";
import { Box } from "@mui/system";
import { useWorkflows } from "@/context/WorkflowsContext";
import { useRouter } from "next/router";

const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID!;
const COMPUTE_ENV_ID = process.env.NEXT_PUBLIC_COMPUTE_ID!;
const WORK_DIR = process.env.NEXT_PUBLIC_WORK_DIR!;

export default function WorkflowLauncher() {
  const context = useWorkflows();
  const workflows = context?.workflows;
  const params = useRouter();
  const workflowId = Number(params?.query?.id);
  const workflow = workflows?.find(wf => wf.id === workflowId)  

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
  const [runID, setRunId] = useState("");
  const [schema, setSchema] = useState<WorkflowInputSchema | null>(null);
  const [inputParams, setInputParams] = useState<InputParams[] | []>([]);

  const methods = useForm({
    mode: "onSubmit"
  });

  // fetch input schema
  useEffect(() => {
    const fetchSchema = async () => {
      if (!workflow?.schema) return;
      const res = await fetch(workflow?.schema);
      const data = await res.json();
      console.log("data: ", data)
      // Attempt to extract 'input_output_options' from either '$defs' or 'definitions' section of the schema.
      const inputSchema: WorkflowInputSchema = (data.$defs || data.definitions)
        .input_output_options ?? { required: [], properties: [] };

      setSchema(inputSchema);
      ;
      const required: string[] = inputSchema?.required ?? [];
      const params: InputParams[] = Object.entries(inputSchema.properties).map(
        ([key, value]: [string, any]) => ({
          key,
          description: value?.description,
          format: value?.format,
          enum: value?.enum || [],
          help_text: value?.help_text,
          pattern: value?.pattern,
          type: value?.type,
          required: required.includes(key)
        })
      );
      setInputParams(params);
    };
    fetchSchema();
  }, [workflow?.schema]);
  console.log(inputParams)
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
      setRunId(result);
      setStatus("done");
    } catch (error) {
      console.log("error: ", error);
      setStatus("error");
    }
  };
  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1} }}
      noValidate
      autoComplete="off"
    >
      <FormProvider methods={methods} onSubmit={handleClick}>
        {inputParams.map((param) => {
          // boolean schema
          switch (param.type) {
            case "boolean":
              return (
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label={param.key.toUpperCase()}
                />
              );
            default:
              // string/integer schema
              if (param?.enum?.length > 0) {
                // enumerated values
                return (<FTextField
                  required={param.required}
                  name={param.key}
                  label={param.key.toUpperCase()}
                  helperText={param.help_text}
                  size="small"
                  select
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      )
                    }
                  }}
                  >
                    {param.enum.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                </FTextField>)
              } else {
                // string input
                return (<FTextField
                required={param.required}
                name={param.key}
                label={param.key.toUpperCase()}
                helperText={param.help_text}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    )
                  }
                }}
              />)
              }
          }
        })}
      </FormProvider>
      <Button type="submit" variant="contained">
        Launch Workflow
      </Button>
      {status === "done" && <Typography>Launched {runID}</Typography>}
      {status === "error" && <Typography color="error.main">Error</Typography>}
    </Box>
  );
}
