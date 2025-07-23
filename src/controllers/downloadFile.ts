
export async function downloadFile(
  workflowId: string
): Promise<any> {
  const response = await fetch(`/api/downloadFile?workflowId=${workflowId}`, {
    method: "GET"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Fail to get launch log files: ${response.status} ${data?.message || JSON.stringify(data)}`
    );
  }

  const log = await data.log;
  return log;
}
