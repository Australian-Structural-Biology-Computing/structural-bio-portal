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
  const workflows = context?.workflows;
  const router = useRouter();
  const workflowId = Number(router?.query?.id);
  const workflow = workflows?.find((wf) => wf.id === workflowId);

  const [formData, setFormData] = useState<WorkflowLaunchForm>();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [runID, setRunId] = useState("");
  const [wParams, setWParams] = useState<WorkflowParams>({});

  useEffect(() => {
    if (!workflow?.schema) return;

    const loadParams = async () => {
      try {
        const parsed = await parseWorkflowSchema(workflow.schema);
        setWParams(parsed);
      } catch (error) {
        console.error("Error loading workflow schema:", error);
      }
    };

    loadParams();
  }, [workflow?.schema]);
  const handleSubmit = async (data?: any) => {
    try {
      setStatus("loading");
      const formToUse = data ?? formData;
      if (!formToUse) {
        alert("No form data found.");
        setStatus("idle");
        return;
      }
      // setFormData(formToUse);
      const convertedParams = convertFormData(formToUse, wParams);

      // setFormData(convertedParams);
      // if it's the final submit (in case 2)
      const fullPayload: WorkflowLaunchForm = {
        pipeline: workflow?.github || "",
        revision: workflow?.revision || "",
        configProfiles: workflow?.configProfiles || [""],
        runName: convertedParams?.["runName"] || "default-name",
        paramsText: JSON.stringify({
          ...convertedParams
        }),
        ...formToUse
      };
      const result = await launchWorkflow(fullPayload);
      console.log("Workflow launched successfully:", result);
      setRunId(result);
      setStatus("done");
      setTimeout(() => router.push({ pathname: "/jobs" }), 3000);
    } catch (error: any) {
      console.error("Launch failed:", error);
      setStatus("error");
    }
  };

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
          <FormProvider methods={methods}>
            <form
              onSubmit={methods.handleSubmit((data) => {
                handleSubmit(data);
              })}
            >
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
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Final Submit
                </Button>
              </Box>
            </form>
          </FormProvider>
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
      {status === "idle" && (
        <FormProvider {...{ methods }}>
          <StepperLayout
            steps={["Job Info", "Input Parameters", "Review & Launch"]}
            stepContent={stepContent}
          />{" "}
        </FormProvider>
      )}
      {status === "loading" && (
        <>
          <CircularProgress />
          <Typography variant="body1">Your job is submitting...</Typography>
        </>
      )}
      {status === "done" && (
        <Alert severity="success">
          Successfully launched workflow ID: {runID}
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error">Some errors happened!</Alert>
      )}
    </Box>
  );
}
