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
    pipeline: string;
    workspaceId: string;
    computeEnvId: string;
    workDir: string;
    runName: string;
    revision: string;
    configProfiles: string[];
    paramsText: string;
    resume: boolean;
  };
}
// workflow input models
export interface InputParams {
  key: string;
  description: string;
  format: string;
  enum: string[];
  default: string;
  help_text: string;
  pattern: string;
  type: string;
  required: boolean;
}

// workflow params model
export interface WorkflowParams {
  [groupKey: string]: InputParams[];
}
export interface WorkflowInputSchema {
  required: string[];
  properties: {
    input: InputParams;
  };
}

// workflows context model
export interface Workflows {
  id: number;
  title: string;
  description: string;
  github: string;
  schema: string;
  keywords: string[];
}
export interface WorkflowContextType {
  workflows: Workflows[] | null;
}
