export async function cancelWorkflow(workflowId: string) {
  const response = await fetch("/api/cancel", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ workflowId })
  });
}
