import StepperLayout from "@/components/StepperLayout";
import WorkflowLauncher from "@/components/WorkflowLauncher";
import DragDropUploader from "@/components/DragDropUploader";
import { useState } from "react";
import { Button, Typography } from "@mui/material";

export default function RunWorkflowPage() {
  const handleSubmit = async (formValues: any) => {
    console.log("Form submitted:", formValues);
    // launchWorkflow logic here
  };

  const stepContent = (step: number) => {
    switch (step) {
      case 0:
        return <WorkflowLauncher onSubmit={handleSubmit} />;
      case 1:
        return <DragDropUploader />;
      case 2:
        return (
          <>
            <Typography variant="h6">Review</Typography>
            <Typography>Ready to launch your job.</Typography>
            <Button
              variant="contained"
              onClick={() => handleSubmit({ "run-name": "from-review" })}
            >
              Final Submit
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <StepperLayout
      steps={["Job Info", "Input Parameters", "Review & Launch"]}
      stepContent={stepContent}
    />
  );
}
