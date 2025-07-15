import StepperLayout from "@/components/StepperLayout";
import WorkflowLauncher from "@/components/WorkflowLauncher";
import { Button, Typography } from "@mui/material";
import { WorkflowLaunchForm } from "@/models/workflow";
import { launchWorkflow } from "@/controllers/launchWorkflow";
import { useState } from "react";
import FormProvider from "@/components/form/FormProvider";
import { useForm } from "react-hook-form";
import WorkflowParamsPage from "@/components/WorkflowParams";
import ParamsSummary from "@/components/ParamsSummary";
import { Box, Stack } from "@mui/system";

export default function RunWorkflowPage() {
  const WORKSPACE_ID = process.env.NEXT_PUBLIC_WORKSPACE_ID!;
  const COMPUTE_ENV_ID = process.env.NEXT_PUBLIC_COMPUTE_ID!;
  const WORK_DIR = process.env.NEXT_PUBLIC_WORK_DIR!;
  const methods = useForm({ mode: "onSubmit" });

  const [formData, setFormData] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [runID, setRunId] = useState("");

  const handleSubmit = async (data?: any) => {
    try {
      setStatus("loading");
      const formToUse = data ?? formData;
      if (!formToUse) {
        alert("No form data found.");
        setStatus("idle");
        return;
      }
      setFormData(formToUse);
      // if it's the final submit (in case 2)
      const fullPayload: WorkflowLaunchForm = {
        pipeline: "https://github.com/nextflow-io/hello",
        workspaceId: WORKSPACE_ID,
        computeEnvId: COMPUTE_ENV_ID,
        workDir: WORK_DIR,
        runName: formToUse?.["run-name"] || "default-name",
        ...formToUse
      };

      const result = await launchWorkflow(fullPayload);
      console.log("Workflow launched successfully:", result);
      setRunId(result);
      setStatus("done");
      console.log("runId: ", runID);
    } catch (error: any) {
      console.error("Launch failed:", error);
      setStatus("error");
    }
  };

  const stepContent = (step: number) => {
    switch (step) {
      case 0:
        return <WorkflowLauncher methods={methods} onSubmit={handleSubmit} />;
      case 1:
        return <WorkflowParamsPage methods={methods} onSubmit={handleSubmit} />;
      case 2:
        const submittedData = methods.watch();
        return (
          <Box sx={{ width: "100%" }}>
            <Stack
              spacing={1}
              alignContent="center"
              sx={{
                mb: 2,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              {submittedData &&
                Object.entries(submittedData).map(([key, value]) => (
                  <ParamsSummary
                    key={key}
                    paramKey={key}
                    value={value}
                    onChange={(newVal) => methods.setValue(key, newVal)}
                  />
                ))}
            </Stack>
            <Button
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              Final Submit
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...{ methods }}>
      <StepperLayout
        steps={["Job Info", "Input Parameters", "Review & Launch"]}
        stepContent={stepContent}
      />
      {status === "done" && <Typography>Launched {runID}</Typography>}
      {status === "error" && <Typography color="error.main">Error</Typography>}
    </FormProvider>
  );
}
