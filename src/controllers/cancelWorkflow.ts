export async function cancelWorkflow(workflowId: string): Promise<string> {
    
    const response = await fetch("/api/cancel", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ workflowId })
    });
    if (!response.ok) {
        const errorMess = await response.text()
        throw new Error(`Fail to cancel workflow id: ${workflowId}: ${response.status} ${errorMess}`)
    }

    return response.json();
}