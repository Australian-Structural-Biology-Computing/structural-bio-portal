import StepperLayout from "@/components/StepperLayout";
import WorkflowLauncher from "@/components/WorkflowLauncher";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { WorkflowLaunchForm, WorkflowParams } from "@/models/workflow";
import { launchWorkflow } from "@/controllers/launchWorkflow";
import { useEffect, useState } from "react";
import FormProvider from "@/components/form/FormProvider";
import { useForm } from "react-hook-form";
import WorkflowParamsPage from "@/components/WorkflowParams";
import ParamsSummary from "@/components/ParamsSummary";
import { Box, Stack } from "@mui/system";
import { useWorkflows } from "@/context/DBContext";
import { useRouter } from "next/router";
import { convertFormData } from "@/utils/convertFormData";
import { parseWorkflowSchema } from "@/utils/parseWorkflowSchema";

export default function RunWorkflowPage() {
  const methods = useForm({ mode: "onSubmit" });
  const context = useWorkflows();
  const workflows = context.workflows;
  const router = useRouter();
  const workflowId = Number(router.query.id);
  const workflow = workflows?.find((wf) => wf.id === workflowId);

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
              Object.entries(submittedData).map(([key, value]) => (
                <ParamsSummary
                  key={key}
                  paramKey={key}
                  value={value}
                  onChange={(newVal) => methods.setValue(key, newVal)}
                  methods={methods}
                />
              ))}
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
