export async function cancelWorkflow(workflowId: string): Promise<string> {
    
    const response = await fetch("/api/cancel", workflowId);
    if (!response.ok) {
        const errorMess = await response.text()
        throw new Error(`Fail to cancel workflow id: ${workflowId}: ${response.status} ${errorMess}`)
    }
}