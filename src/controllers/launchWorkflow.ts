import { WorkflowLaunchForm } from "@/models/workflow";

export async function launchWorkflow(
  form: WorkflowLaunchForm
): Promise<string> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      workspaceId: process.env.NEXT_PUBLIC_WORKSPACE_ID,
      computeEnvId: process.env.NEXT_PUBLIC_COMPUTE_ID,
      workDir: process.env.NEXT_PUBLIC_WORK_DIR,
      runName: form.runName || "hello-from-ui",
      pipeline: form.pipeline || "https://github.com/nextflow-io/hello",
      configProfiles: [],
      paramsText: form.paramsText,
      resume: false
    })
  };
  const response = await fetch("/api/launch", request);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Workflow launch failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  // assuming the API returns workflow ID as `workflowId`
  return data.data.workflowId;
}
