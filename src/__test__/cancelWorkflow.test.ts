import { cancelWorkflow } from "@/controllers/cancelWorkflow";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("cancelWorkflow", () => {
  const workflowId = "wf-test";

  afterEach(() => vi.restoreAllMocks());

  it("positive: returns success message on 204", async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 204 })
    );

    const msg = await cancelWorkflow(workflowId);
    expect(msg).toBe("Workflow cancelled successfully.");
  });

  it("positive: returns message for 200 OK", async () => {
    const body = { message: "Already cancelled" };
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));

    const msg = await cancelWorkflow(workflowId);
    expect(msg).toBe("Already cancelled");
  });

  it("negative: ok is false", async () => {
    const body = { message: "Workflow not found" };
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(body), { status: 404 }));

    await expect(cancelWorkflow(workflowId)).rejects.toThrow(
      "Fail to list workflow runs: 404 Workflow not found"
    );
  });

  it("fail api: propagates fetch errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network fail"));
    await expect(cancelWorkflow(workflowId)).rejects.toThrow("Network fail");
  });
});
