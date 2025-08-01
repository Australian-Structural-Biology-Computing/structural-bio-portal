import StepperLayout from "@/components/StepperLayout";
import WorkflowLauncher from "@/components/WorkflowLauncher";
import { Alert } from "@mui/material";
import { InputParams } from "@/models/workflow";
import { useEffect, useState } from "react";
import FormProvider from "@/components/form/FormProvider";
import { useForm } from "react-hook-form";
import WorkflowParamsPage from "@/components/WorkflowParams";
import ParamsSummary from "@/components/ParamsSummary";
import { Box, Stack } from "@mui/system";
import { useWorkflows } from "@/context/DBContext";
import { useRouter } from "next/router";

export default function RunWorkflowPage() {
  const methods = useForm({
    mode: "onChange", // validate as the user types
    reValidateMode: "onChange" // re-validate immediately when input changes
  });
  const context = useWorkflows();
  const workflows = context.workflows;
  const router = useRouter();
  const workflowId = Number(router.query.id);
  const workflow = workflows?.find((wf) => wf.id === workflowId);
  const [wParams, setWParams] = useState<InputParams[]>([]);

  useEffect(() => {
    if (!workflow?.schema) return;

    const loadParams = async () => {
      try {
        const res = await fetch(workflow.schema);
        const data = await res.json();

        const inputSchema = data.$defs?.input_output_options ||
          data.definitions?.input_output_options || {
            required: [],
            properties: {}
          };

        const workflowSchema = data.$defs?.workflow_parameters ||
          data.definitions?.workflow_parameters || {
            required: [],
            properties: {}
          };

        const extractParams = (schema: any): InputParams[] => {
          const required = schema.required ?? [];
          return Object.entries(schema.properties || {}).map(
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
        };

        const combinedParams = [
          ...extractParams(inputSchema),
          ...extractParams(workflowSchema)
        ];
        setWParams(combinedParams);
      } catch (error) {
        console.error("Error loading workflow schema:", error);
      }
    };

    loadParams();
  }, [workflow?.schema]);

  const stepContent = (step: number) => {
    switch (step) {
      //step 1: input-output options
      case 0:
        return <WorkflowLauncher methods={methods} />;
      //step 2: workflow params
      case 1:
        return <WorkflowParamsPage methods={methods} />;
      //step 3: summary
      case 2:
        const submittedData = methods.watch();
        return (
          <Stack
            spacing={1}
            alignContent="center"
            sx={{
              mb: 2,
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%"
            }}
          >
            {submittedData &&
              Object.entries(submittedData).map(([key, value]) => {
                const paramMeta = wParams.find((p) => p.key === key);
                return (
                  <ParamsSummary
                    key={key}
                    paramKey={key}
                    value={value}
                    onChange={(newVal) => methods.setValue(key, newVal)}
                    methods={methods}
                    type={paramMeta?.type}
                    enumOptions={paramMeta?.enum}
                    required={paramMeta?.required}
                    pattern={paramMeta?.pattern}
                    help_text={paramMeta?.help_text}
                    description={paramMeta?.description}
                  />
                );
              })}
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {workflow ? (
        <FormProvider {...{ methods }}>
          <StepperLayout
            steps={["Job Info", "Input Parameters", "Review & Launch"]}
            stepContent={stepContent}
            methods={methods}
          />{" "}
        </FormProvider>
      ) : (
        <Alert severity="error">
          There is no pre-config workflow available now. Please try another
          pre-config workflow group!
        </Alert>
      )}
    </Box>
  );
}
