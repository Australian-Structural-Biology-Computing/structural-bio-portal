import type { ResponseData } from "@/pages/api/downloadFile";

export async function downloadFile(workflowId: string): Promise<ResponseData> {
  const response = await fetch(`/api/downloadFile?workflowId=${workflowId}`, {
    method: "GET"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Fail to download file from S3: ${response.status} ${data?.message || JSON.stringify(data)}`
    );
  }

  return data;
}
