export interface WorkflowLaunchForm {
    pipeline: string;
    workspaceId: string;
    computeEnvId: string;
    workDir: string;
    runName: string
}

export interface WorkflowLaunchPayload {
  launch: {
    ppipeline: string;
    workspaceId: string;
    computeEnvId: string;
    workDir: string;
    runName: string;
    revision: string;
  };
}
