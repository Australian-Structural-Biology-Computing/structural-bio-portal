import { LaunchLogs } from "@/models/workflow";

export async function launchLog(workflowId: string): Promise<LaunchLogs> {
  const response = await fetch(`/api/launchLogs?workflowId=${workflowId}`, {
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
