import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "@/pages/api/launchDetails";
import type { NextApiRequest, NextApiResponse } from "next";

global.fetch = vi.fn(); // Mock fetch globally

const mockRes = () => {
  const res: Partial<NextApiResponse> = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res as NextApiResponse;
};

describe("GET /api/launchDetails", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 400 if workflowId is missing", async () => {
    const req = {
      query: {}
    } as Partial<NextApiRequest> as NextApiRequest;

    const res = mockRes();

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing workflowId",
      workflows: []
    });
  });

  it("returns workflow details when fetch succeeds", async () => {
    const mockWorkflow = { id: "wf1", name: "Test Workflow" };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ workflow: mockWorkflow }),
      status: 200
    });

    const req = {
      query: { workflowId: "wf1" }
    } as Partial<NextApiRequest> as NextApiRequest;

    const res = mockRes();

    await handler(req, res);

    expect(fetch).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Got launch details",
      workflows: mockWorkflow
    });
  });

  it("returns 500 when fetch throws an error", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    const req = {
      query: { workflowId: "wf2" }
    } as Partial<NextApiRequest> as NextApiRequest;

    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      workflows: []
    });
  });
});
