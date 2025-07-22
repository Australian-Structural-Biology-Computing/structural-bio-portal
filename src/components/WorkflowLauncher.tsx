"use client";

import { Checkbox, FormControlLabel, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/DBContext";
import FTextField from "@/components/form/FTextField";
import FormProvider from "@/components/form/FormProvider";
import { InputParams, WorkflowInputSchema } from "@/models/workflow";

export default function WorkflowLauncher({ methods }: { methods: UseFormReturn<any> }) {
  const context = useWorkflows();
  const workflows = context?.workflows;
  const params = useRouter();
  const workflowId = Number(params?.query?.id);
  const workflow = workflows?.find((wf) => wf.id === workflowId);
  const [inputParams, setInputParams] = useState<InputParams[]>([]);

  useEffect(() => {
    const fetchSchema = async () => {
      if (!workflow?.schema) return;
      const res = await fetch(workflow.schema);
      const data = await res.json();
      const inputSchema: WorkflowInputSchema = data.$defs
        ?.input_output_options ||
        data.definitions?.input_output_options || {
          required: [],
          properties: {}
        };

      const required = inputSchema.required ?? [];
      const params: InputParams[] = Object.entries(inputSchema.properties).map(
        ([key, value]: [string, any]) => ({
          key,
          description: value?.description,
          format: value?.format,
          enum: value?.enum || [],
          default: value?.default || "",
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

  return (
    <FormProvider methods={methods}>
      <FTextField
        required
        name="runName"
        label="Job Name"
        helperText="Name your workflow"
        size="small"
      />
      {inputParams.map((param) => {
        switch (param.type) {
          case "boolean":
            return (
              <FormControlLabel
                key={param.key}
                control={<Checkbox name={param.key} />}
                label={param.key}
                sx={{ mb: 1 }}
              />
            );
          default:
            if (param.enum.length > 0) {
              return (
                <FTextField
                  key={param.key}
                  name={param.key}
                  label={param.key.charAt(0).toUpperCase() + param.key.slice(1)}
                  select
                  helperText={param.help_text}
                  size="small"
                  sx={{ mb: 2 }}
                >
                  {param.enum.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </FTextField>
              );
            }
            return (
              <FTextField
                key={param.key}
                name={param.key}
                label={param.key.charAt(0).toUpperCase() + param.key.slice(1)}
                helperText={param.help_text}
                sx={{ mb: 2 }}
                size="small"
              />
            );
        }
      })}
    </FormProvider>
  );
}
