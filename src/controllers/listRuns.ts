import { RawRunInfo } from "@/models/workflow";

export async function listRuns(): Promise<RawRunInfo[]> {
  // Get current userid
  const res = await fetch("api/user");
  const userData = await res.json();
  const userId = userData.USER_ID;

  const response = await fetch("/api/listRuns", {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Fail to list workflow runs: ${response.status} ${data?.message || JSON.stringify(data)}`
    );
  }

  // filter workflows owned by current user

  const workflows: RawRunInfo[] = data.workflows;
  const userWorkflows: RawRunInfo[] = workflows.filter(
    (wf: RawRunInfo) => wf?.workflow?.ownerId === userId
  );
  console.log("workflows list: ", userWorkflows);
  return userWorkflows;
}
