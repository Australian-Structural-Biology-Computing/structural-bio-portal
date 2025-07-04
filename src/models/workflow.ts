// workflow properties models

// submit job models
export interface WorkflowLaunchForm {
  pipeline: string;
  workspaceId: string;
  computeEnvId: string;
  workDir: string;
  runName: string;
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
// workflow input models
export interface InputParams {
  key: string;
  description: string;
  format: string;
  help_text: string;
  pattern: string;
  type: string;
  required: boolean;
}
export interface OutputParams {
  description: string;
  format: string;
  type: string;
}
export interface WorkflowInputSchema {
  required: string[];
  properties: {
    input: InputParams;
    outdir: OutputParams;
  };
}

// workflows context model
export interface Workflows {
  id: number;
  title: string;
  href: string;
  description: string;
  github: string;
  keywords: string[];
}
export interface WorkflowContextType {
  workflows: Workflows[] | null;
}
