// workflow properties models

// submit job models
export interface WorkflowLaunchForm {
  pipeline: string;
  workspaceId: string;
  computeEnvId: string;
  workDir: string;
  runName: string;
  revision: string;
  configProfiles: string[];
  paramsText: string;
  preRunScript: string | "module load nextflow";
  resume: boolean | false;
}
export interface WorkflowLaunchPayload {
  launch: WorkflowLaunchForm;
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
  all_in_one: boolean | false;
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
  revision: string | "main";
  configProfiles: string[] | [];
  schema: string;
  keywords: string[];
  theme: string;
  preconfig: string;
}
export interface WorkflowContextType {
  workflows: Workflows[] | null;
  themes: any;
}

export interface RawRunInfo {
  workflow: {
    messages: string[];
    id: string;
    ownerId: number;
    submit: string;
    start: string;
    complete: string;
    dateCreated: string;
    lastUpdated: string;
    runName: string;
    sessionId: string;
    profile: string;
    workDir: string;
    commitId: string;
    userName: string;
    scriptId: string;
    revision: string;
    commandLine: string;
    projectName: string;
    scriptName: string;
    launchId: string;
    status:
      | "SUBMITTED"
      | "RUNNING"
      | "SUCCEEDED"
      | "FAILED"
      | "CANCELLED"
      | "UNKNOWN";
    requiresAttention: boolean;
    configFiles: string[];
    params: Record<string, string>;
    configText: string;
    manifest: {
      nextflowVersion: string;
      defaultBranch: string;
      version: string;
      homePage: string;
      gitmodules: string;
      description: string;
      name: string;
      mainScript: string;
      author: string;
      icon: string;
    };
    nextflow: {
      version: string; //max 20chars
      build: string; // Constraints: max 10 chars
      timestamp: string;
    };
    stats: {
      computeTimeFmt: string;
      cachedCount: number;
      failedCount: number;
      ignoredCount: number;
      succeedCount: number;
      cachedCountFmt: string;
      succeedCountFmt: string;
      failedCountFmt: string;
      ignoredCountFmt: string;
      cachedPct: number;
      failedPct: number;
      succeedPct: number;
      ignoredPct: number;
      cachedDuration: number;
      failedDuration: number;
      succeedDuration: number;
    };
    errorMessage: string;
    errorReport: string;
    deleted: boolean;
    projectDir: string;
    homeDir: string;
    container: string;
    repository: string;
    containerEngine: string;
    scriptFile: string;
    launchDir: string;
    duration: number;
    exitStatus: number;
    resume: boolean;
    success: boolean;
  };
  progress: {
    workflowProgress: {
      pending: number;
      submitted: number;
      running: number;
      succeeded: number;
      failed: number;
      cached: number;
      aborted: number;
      memoryEfficiency: number;
      cpuEfficiency: number;
      cpus: number;
      cpuTime: number;
      cpuLoad: number;
      memoryRss: number;
      memoryReq: number;
      readBytes: number;
      writeBytes: number;
      volCtxSwitch: number;
      invCtxSwitch: number;
      cost: number;
      netCpus: number;
      netCpuTime: number;
      netCpuLoad: number;
      netMemoryRss: number;
      netMemoryReq: number;
      netReadBytes: number;
      netWriteBytes: number;
      netVolCtxSwitch: number;
      netInvCtxSwitch: number;
      netCost: number;
      loadTasks: number;
      loadCpus: number;
      loadMemory: number;
      peakCpus: number;
      peakTasks: number;
      peakMemory: number;
      executors: string[];
      dateCreated: string;
      lastUpdated: string;
    };
    processesProgress: [
      {
        pending: number;
        submitted: number;
        running: number;
        succeeded: number;
        failed: number;
        cached: number;
        aborted: number;
        memoryEfficiency: number;
        cpuEfficiency: number;
        process: string;
        cpus: number;
        cpuTime: number;
        cpuLoad: number;
        memoryRss: number;
        memoryReq: number;
        readBytes: number;
        writeBytes: number;
        volCtxSwitch: number;
        invCtxSwitch: number;
        loadTasks: number;
        loadCpus: number;
        loadMemory: number;
        peakCpus: number;
        peakTasks: number;
        peakMemory: number;
        dateCreated: string;
        lastUpdated: string;
      }
    ];
    totalProcesses: number;
  };
  orgId: number;
  orgName: string;
  workspaceId: number;
  workspaceName: string;
  labels: [
    {
      id: number;
      name: string;
      value: string;
      resource: boolean;
      isDefault: boolean;
      isDynamic: boolean;
      isInterpolated: boolean;
      dateCreated: string;
    }
  ];
  starred: boolean;
  optimized: boolean;
}
export interface RunInfo {
  id: string;
  run: string;
  workflow: string;
  status: string;
  date: string;
  cancel: string
}