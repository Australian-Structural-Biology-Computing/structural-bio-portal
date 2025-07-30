import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const REGION = process.env.AWS_REGION!;
const BUCKET_NAME = process.env.S3_BUCKET!;
const S3_BASE_URL = process.env.S3_URL!;
// Get the public output files from S3 bucket
export type ResponseData = {
  result: string;
  files: string[];
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const workflowId = req.query.workflowId as string;

  if (!workflowId) {
    return res
      .status(400)
      .json({ message: "Missing workflowId", result: "", files: [] });
  }

  const s3 = new S3Client({ region: REGION });

  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `reports/`
    });

    const response = await s3.send(command);
    // avoid getting "folders"
    const contents = (response.Contents ?? []).filter(
      (obj) => obj.Key && !obj.Key.endsWith("/")
    );

    // display multiqc report in results tab, the others are in files tab
    const htmlFile = contents.find((obj) => obj.Key === "multiqc_report.html");

    // other files except multiqc_report.html
    const filesToDownload = contents
      .filter((obj) => obj.Key && obj.Key !== "multiqc_report.html")
      .map((obj) => `${S3_BASE_URL}/${obj.Key}`);

    if (!htmlFile && filesToDownload.length === 0) {
      return res
        .status(404)
        .json({ message: "No output files found!", result: "", files: [] });
    } else if (htmlFile && filesToDownload.length === 0) {
      const fileUrl = `${S3_BASE_URL}/${htmlFile.Key}`;
      return res.status(200).json({
        message: "Results: found 1. Files to download: 0",
        result: fileUrl,
        files: []
      });
    } else if (!htmlFile && filesToDownload.length > 0) {
      return res.status(200).json({
        message: "No multiqc_report.html found!",
        result: "",
        files: filesToDownload
      });
    } else {
      const fileUrl = `${S3_BASE_URL}/${htmlFile?.Key}`;
      return res.status(200).json({
        message: "Found HTML file and output files to download",
        result: fileUrl,
        files: filesToDownload
      });
    }
  } catch (error) {
    console.error("Error listing S3 files: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", result: "", files: [] });
  }
}
