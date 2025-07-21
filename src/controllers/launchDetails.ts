
export async function launchDetails(workflowId: string): Promise<Record<string, any>> {

  const response = await fetch(`/api/launchDetails?workflowId=${workflowId}`, {
    method: "GET"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Fail to list workflow details: ${response.status} ${data?.message || JSON.stringify(data)}`
    );
  }

  const workflows = data.launch;
  return workflows;
}
