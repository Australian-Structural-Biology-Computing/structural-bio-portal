// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { launchWorkflow } from "@/controllers/launchWorkflow";
import { WorkflowLaunchForm } from "@/models/workflow";

const baseForm: WorkflowLaunchForm = {
  runName: "ui-test",
  pipeline: "https://github.com/nextflow-io/hello",
  revision: "main",
  configProfiles: [],
  paramsText: JSON.stringify({ batches: 1 }),
  workspaceId: "",
  computeEnvId: "",
  workDir: "",
  preRunScript: "module load nextflow",
  resume: false
};

describe("launchWorkflow controller", () => {
  afterEach(() => vi.restoreAllMocks());

  it("positive test:returns workflowId on 200 OK", async () => {
    // mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { workflowId: "wf-123" } })
    } as unknown as Response);

    const id = await launchWorkflow(baseForm);

    // assertions
    expect(id).toBe("wf-123");
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/launch",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String)
      })
    );
    // body should include runName
    const [, reqInit] = (global.fetch as any).mock.calls[0];
    expect(reqInit.body).toContain('"runName":"ui-test"');
  });

  it("negative test: throws formatted error when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve("Bad Request")
    } as unknown as Response);

    await expect(launchWorkflow(baseForm)).rejects.toThrow(
      "Workflow launch failed: 400 Bad Request"
    );
  });

  it("network test: propagates network errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network down"));

    await expect(launchWorkflow(baseForm)).rejects.toThrow("Network down");
  });
});
