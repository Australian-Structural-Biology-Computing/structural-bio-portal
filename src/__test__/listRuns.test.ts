// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { listRuns } from "@/controllers/listRuns";
import { RawRunInfo } from "@/models/workflow";

describe("listRuns", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockUserId = 123; // match the `ownerId: number` type

  const mockRuns: RawRunInfo[] = [
    {
      workflow: {
        id: "wf-1",
        ownerId: mockUserId,
        runName: "test-run",
        status: "SUCCEEDED",
        submit: "",
        start: "",
        complete: "",
        dateCreated: "",
        lastUpdated: "",
        sessionId: "",
        profile: "",
        workDir: "",
        commitId: "",
        userName: "",
        scriptId: "",
        revision: "",
        commandLine: "",
        projectName: "",
        scriptName: "",
        launchId: "",
        requiresAttention: false,
        configFiles: [],
        params: {},
        configText: "",
        manifest: {
          nextflowVersion: "",
          defaultBranch: "",
          version: "",
          homePage: "",
          gitmodules: "",
          description: "",
          name: "",
          mainScript: "",
          author: "",
          icon: ""
        },
        nextflow: {
          version: "",
          build: "",
          timestamp: ""
        },
        stats: {
          computeTimeFmt: "",
          cachedCount: 0,
          failedCount: 0,
          ignoredCount: 0,
          succeedCount: 0,
          cachedCountFmt: "",
          succeedCountFmt: "",
          failedCountFmt: "",
          ignoredCountFmt: "",
          cachedPct: 0,
          failedPct: 0,
          succeedPct: 0,
          ignoredPct: 0,
          cachedDuration: 0,
          failedDuration: 0,
          succeedDuration: 0
        },
        errorMessage: "",
        errorReport: "",
        deleted: false,
        projectDir: "",
        homeDir: "",
        container: "",
        repository: "",
        containerEngine: "",
        scriptFile: "",
        launchDir: "",
        duration: 0,
        exitStatus: 0,
        resume: false,
        success: true,
        messages: []
      },
      progress: {
        workflowProgress: {
          pending: 0,
          submitted: 0,
          running: 0,
          succeeded: 0,
          failed: 0,
          cached: 0,
          aborted: 0,
          memoryEfficiency: 0,
          cpuEfficiency: 0,
          cpus: 0,
          cpuTime: 0,
          cpuLoad: 0,
          memoryRss: 0,
          memoryReq: 0,
          readBytes: 0,
          writeBytes: 0,
          volCtxSwitch: 0,
          invCtxSwitch: 0,
          cost: 0,
          netCpus: 0,
          netCpuTime: 0,
          netCpuLoad: 0,
          netMemoryRss: 0,
          netMemoryReq: 0,
          netReadBytes: 0,
          netWriteBytes: 0,
          netVolCtxSwitch: 0,
          netInvCtxSwitch: 0,
          netCost: 0,
          loadTasks: 0,
          loadCpus: 0,
          loadMemory: 0,
          peakCpus: 0,
          peakTasks: 0,
          peakMemory: 0,
          executors: [],
          dateCreated: "",
          lastUpdated: ""
        },
        processesProgress: [
          {
            pending: 0,
            submitted: 0,
            running: 0,
            succeeded: 0,
            failed: 0,
            cached: 0,
            aborted: 0,
            memoryEfficiency: 0,
            cpuEfficiency: 0,
            process: "",
            cpus: 0,
            cpuTime: 0,
            cpuLoad: 0,
            memoryRss: 0,
            memoryReq: 0,
            readBytes: 0,
            writeBytes: 0,
            volCtxSwitch: 0,
            invCtxSwitch: 0,
            loadTasks: 0,
            loadCpus: 0,
            loadMemory: 0,
            peakCpus: 0,
            peakTasks: 0,
            peakMemory: 0,
            dateCreated: "",
            lastUpdated: ""
          }
        ],
        totalProcesses: 0
      },
      orgId: 1,
      orgName: "TestOrg",
      workspaceId: 1,
      workspaceName: "TestWS",
      labels: [
    {
      id: 0,
      name: "",
      value: "",
      resource: false,
      isDefault: false,
      isDynamic: false,
      isInterpolated: false,
      dateCreated: "",
    }
  ],
      starred: false,
      optimized: false
    }
  ];

  it("positive test: filters and returns user workflows", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ USER_ID: mockUserId }),
          ok: true
        } as Response)
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ workflows: mockRuns }),
          ok: true
        } as Response)
    );

    const result = await listRuns();
    expect(result).toHaveLength(1);
    expect(result[0].workflow.ownerId).toBe(mockUserId);
  });

  it("negative test: throws an error if listRuns fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ USER_ID: mockUserId }),
          ok: true
        } as Response)
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ message: "error" }),
          ok: false,
          status: 500
        } as Response)
    );

    await expect(listRuns()).rejects.toThrow(
      'Fail to list workflow runs: 500 error'
    );
  });
});
