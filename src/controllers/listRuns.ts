export async function listRuns(): Promise<any[]> {
  // Get current userid
  const res = await fetch("api/user")
  const userData = await res.json()
  const userId = userData.USER_ID;

  const response = await fetch("/api/listRuns", {
    method: "GET",
    headers: {
      "Content-type": "application/json"
    },
  });
  if (!response.ok) {
    const errorMess = await response.text();
    throw new Error(
      `Fail to list workflow id list runs: ${response.status} ${errorMess}`
    );
  }
  // filter workflows owned by current user
  const workflows = await response.json()
  const userWorkflows = workflows.filter((wf: any) => wf?.workflow?.ownerId === userId);
  return userWorkflows;
}
