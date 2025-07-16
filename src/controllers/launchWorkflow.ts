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
      workspaceId: process.env.WORKSPACE_ID,
      computeEnvId: process.env.COMPUTE_ID,
      workDir: process.env.WORK_DIR,
      runName: form.runName || "hello-from-ui",
      pipeline: form.pipeline || "https://github.com/nextflow-io/hello",
      configProfiles: [],
      paramsText: form.paramsText,
      resume: false
    })
  };
  const response = await fetch("/api/launch", request);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Fail to list workflow runs: ${response.status} ${data?.message || JSON.stringify(data)}`
    );
  }

  // assuming the API returns workflow ID as `workflowId`
  return data.workflowId;
}
