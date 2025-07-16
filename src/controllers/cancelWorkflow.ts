export async function cancelWorkflow(workflowId: string) {
  const response = await fetch("/api/cancel", {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ workflowId })
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Fail to list workflow runs: ${response.status} ${data?.message || JSON.stringify(data)}`
    );
  }

  return data.message;
}
