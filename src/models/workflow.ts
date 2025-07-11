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

// raw db models
export interface RawTool {
  id: number;
  title: string;
  description: string;
  github: string;
  schema: string;
  keywords: string[];
}

export interface RawWorkflowGroup {
  description: string;
  github: string;
  schema: string;
  keywords: string[];
  tools?: RawTool[];
}

export type RawPreconfig = Record<string, RawWorkflowGroup>;
export interface RawThemes {
  description: string;
  preconfig: RawPreconfig[];
}

export type RawDB = Record<string, RawThemes>;

// workflows context model
export interface Workflows {
  id: number;
  title: string;
  description: string;
  github: string;
  schema: string;
  keywords: string[];
  theme: string;
  preconfig: string;
}
export interface WorkflowContextType {
  workflows: Workflows[] | null;
  themes: any;
}

