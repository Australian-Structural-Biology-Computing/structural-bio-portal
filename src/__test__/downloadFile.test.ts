import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../pages/api/downloadFile";

// Use a shared sendMock for all tests
const sendMock = vi.fn();

vi.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: vi.fn().mockImplementation(() => ({
      send: sendMock
    })),
    ListObjectsV2Command: vi.fn()
  };
});

const S3_BASE_URL = process.env.S3_URL;

describe("GET /api/downloadFile", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      query: { workflowId: "test-id" }
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    sendMock.mockReset();
  });

  it("returns 200 with signed URL and files if workflowId is valid", async () => {
    sendMock.mockResolvedValue({
      Contents: [
        { Key: "multiqc_report.html" },
        { Key: "file1.txt" },
        { Key: "file2.csv" }
      ]
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Found HTML file and output files to download",
      result: `${S3_BASE_URL}/multiqc_report.html`,
      files: [`${S3_BASE_URL}/file1.txt`, `${S3_BASE_URL}/file2.csv`]
    });
  });

  it("returns 404 if no output files found", async () => {
    sendMock.mockResolvedValue({ Contents: [{}]  });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No output files found!",
      result: "",
      files: []
    });
  });

  it("returns 500 if S3 throws an error", async () => {
    sendMock.mockRejectedValue(new Error("S3 error"));

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      result: "",
      files: []
    });
  });
});
