"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import FormProvider from "./form/FormProvider";
import { useForm } from "react-hook-form";
import { WorkflowLaunchForm, WorkflowParams } from "@/models/workflow";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/DBContext";
import { convertFormData } from "@/utils/convertFormData";
import { launchWorkflow } from "@/controllers/launchWorkflow";
import { parseWorkflowSchema } from "@/utils/parseWorkflowSchema";

export default function StepperLayout({
  steps,
  stepContent,
  methods
}: {
  steps: string[];
  stepContent: (step: number) => ReactNode;
  methods: ReturnType<typeof useForm>;
}) {
  const router = useRouter();
  const context = useWorkflows();
  const workflows = context.workflows;
  const workflowId = Number(router.query.id);
  const workflow = workflows?.find((wf) => wf.id === workflowId);
  const [formData] = useState<WorkflowLaunchForm>();
  const [wParams, setWParams] = useState<WorkflowParams>({});

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [runID, setRunId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
      setErrorMsg(error);
    }
  };

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({});

  const totalSteps = () => steps.length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () =>
    Object.keys(completed).length === totalSteps();

  const handleNext = () => {
    const nextStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((_, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(nextStep);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleStep = (step: number) => () => setActiveStep(step);

  const handleComplete = async () => {
    const valid = await methods.trigger(); // validate all fields

    if (valid) {
      setCompleted({ ...completed, [activeStep]: true });
      handleNext();
    } else {
      // Optional: scroll to first error
      const firstErrorField = Object.keys(methods.formState.errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el && "scrollIntoView" in el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: "100%" }} display="flex" flexDirection="column">
      {status === "loading" && (
        <>
          <CircularProgress />
          <Typography variant="body1">Your job is submitting...</Typography>
        </>
      )}
      {status === "done" && (
        <Alert severity="success">
          Successfully launched workflow ID: {runID}! Re-directing to the job
          list...
        </Alert>
      )}
      {status === "error" && (
        <Alert severity="error">
          Error:{" "}
          {typeof errorMsg === "string" ? errorMsg : "Something went wrong!"}
        </Alert>
      )}
      {status === "idle" && (
        <form
          onSubmit={methods.handleSubmit((data) => {
            handleSubmit(data);
          })}
        >
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ m: 2, p: 3 }}>
            {/* Show only the current step */}
            {stepContent(activeStep)}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext} sx={{ mr: 1 }}>
              Next
            </Button>
            {/* Show Finish button only if it's the last step and all previous steps are completed */}
            {!completed[activeStep] &&
              Object.keys(completed).length === totalSteps() - 1 && (
                <Button type="submit" variant="contained">
                  Finish
                </Button>
              )}
            {/* Show Complete button if the current step is not completed */}
            {!completed[activeStep] &&
              !(Object.keys(completed).length === totalSteps() - 1) && (
                <Button onClick={handleComplete}>Complete step</Button>
              )}
          </Box>

          {allStepsCompleted() && (
            <Box sx={{ mt: 2 }}>
              <Typography>All steps completed - you are finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 2 }}>
                Reset
              </Button>
            </Box>
          )}
        </form>
      )}
    </Box>
  );
}
