import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "@/pages/api/launchLogs"; // Update the path if needed
import type { NextApiRequest, NextApiResponse } from "next";

global.fetch = vi.fn(); // Mock fetch globally

const mockRes = () => {
  const res: Partial<NextApiResponse> = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res as NextApiResponse;
};

describe("GET /api/launchLogs", () => {
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
      log: []
    });
  });

  it("returns logs when fetch succeeds", async () => {
    const mockLog = {
      stdout: "log line 1\nlog line 2",
      stderr: "",
      exitCode: 0
    };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ log: mockLog }),
      status: 200
    });

    const req = {
      query: { workflowId: "wf-log-test" }
    } as Partial<NextApiRequest> as NextApiRequest;

    const res = mockRes();

    await handler(req, res);

    expect(fetch).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Got launch logs",
      log: mockLog
    });
  });

  it("returns 500 when fetch fails", async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("API failure")
    );

    const req = {
      query: { workflowId: "wf-log-error" }
    } as Partial<NextApiRequest> as NextApiRequest;

    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      log: []
    });
  });
});
