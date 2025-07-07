"use client";

import React, { ReactNode, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography
} from "@mui/material";


export default function StepperLayout({
  steps,
  stepContent
}: {
  steps: string[];
  stepContent: (step: number) => ReactNode;
}) {
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
  const handleComplete = () => {
    setCompleted({ ...completed, [activeStep]: true });
    handleNext();
  };
  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: "100%" }}>
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
        <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={handleNext} sx={{ mr: 1 }}>
          Next
        </Button>
        {!completed[activeStep] && (
          <Button onClick={handleComplete}>
            {Object.keys(completed).length === totalSteps() - 1
              ? "Finish"
              : "Complete Step"}
          </Button>
        )}
      </Box>

      {allStepsCompleted() && (
        <Box sx={{ mt: 2 }}>
          <Typography>All steps completed - you're finished</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </Box>
      )}
    </Box>
  );
}
