"use client";

import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/WorkflowsContext";
import FTextField from "@/components/form/FTextField";
import FormProvider from "@/components/form/FormProvider";
import { InputParams, WorkflowParams } from "@/models/workflow";
import DragDropUploader from "./DragDropUploader";


export default function WorkflowParamsPage({
    onSubmit,
    methods
}: {
    onSubmit: (formValues: any) => void;
    methods: UseFormReturn<any>;
}) {
    const context = useWorkflows();
    const workflows = context?.workflows;
    const params = useRouter();
    const workflowId = Number(params?.query?.id);
    const workflow = workflows?.find((wf) => wf.id === workflowId);
  const [wParams, setWParams] = useState<WorkflowParams>({});

  useEffect(() => {
    const fetchSchema = async () => {
      if (!workflow?.schema) return;
      const res = await fetch(workflow.schema);
      const data = await res.json();
       
      const paramsSchema = data.$defs ||
        data.definitions
      // exclude the following params
      const excludeParams = [
        "input_output_options",
        "max_job_request_options",
        "generic_options",
        "institutional_config_options"
      ];

      const params: WorkflowParams = Object.entries(paramsSchema)
        .filter(([key]) => !excludeParams.includes(key))
        .reduce(
          (acc: WorkflowParams, [groupKey, groupValue]: [string, any]) => {
            const props = groupValue?.properties ?? {};
            const inputs: InputParams[] = Object.entries(props).map(
              ([paramKey, paramValue]: [string, any]) => ({
                key: paramKey,
                description: paramValue?.description,
                format: paramValue?.format,
                enum: paramValue?.enum || [],
                default: paramValue?.default || "",
                help_text: paramValue?.help_text,
                pattern: paramValue?.pattern,
                type: paramValue?.type,
                required: false
              })
            );

            acc[groupKey] = inputs;
            return acc;
          },
          {}
        )

      setWParams(params);
    };

    fetchSchema();
  }, [workflow?.schema]);

  return (
    <FormProvider methods={methods}>
      <form
        onSubmit={methods.handleSubmit((data) => {
          console.log("submitted: ", data);
          onSubmit(data);
        })}
      >
        {Object.entries(wParams).map(([groupKey, groupParams]) => (
          <Accordion key={groupKey}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {groupKey
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {groupParams.map((param, idx) => {
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
                          label={
                            param.key.charAt(0).toUpperCase() +
                            param.key.slice(1)
                          }
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
                    if (param.key === "input") {
                      return (
                        <FormControl>
                          <label>
                            {param.key.charAt(0).toUpperCase() +
                              param.key.slice(1)}
                          </label>
                          <FormHelperText>{param.help_text}</FormHelperText>
                          <DragDropUploader />
                        </FormControl>
                      );
                    }
                    return (
                      <FTextField
                        key={param.key}
                        name={param.key}
                        label={param.key}
                        helperText={param.description}
                        sx={{ mb: 2 }}
                        size="small"
                      />
                    );
                }
              })}
            </AccordionDetails>
          </Accordion>
        ))}
      </form>
    </FormProvider>
  );
}
