"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function DragDropUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "dropped" | "loading" | "done">(
    "idle"
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("dropped");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt"],
      "application/json": [".json"],
      "application/gzip": [".gz"],
      "application/octet-stream": [".fastq", ".fq"]
    }
  });

  const handleStart = () => {
    if (!file) return;

    setStatus("loading");
    setTimeout(() => {
      console.log("Starting project with file:", file.name);
      setStatus("done");
    }, 1000);
  };

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: "center",
        border: "2px dashed #ccc",
        backgroundColor: isDragActive ? "#f0f0f0" : "inherit"
      }}
    >
      <Box {...getRootProps()}>
        <input {...getInputProps()} />
        <CloudUploadIcon fontSize="large" color="action" />
        <Typography variant="h6" mt={1}>
          {isDragActive
            ? "Drop the file here..."
            : "Drag and drop your file here"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select from your computer
        </Typography>
      </Box>

      {file && (
        <Box mt={3}>
          <Typography>
            Selected file: <strong>{file.name}</strong>
          </Typography>
        </Box>
      )}

      {file && (
        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Button
            variant="contained"
            onClick={handleStart}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Launching..." : "Start Project"}
          </Button>
        </Stack>
      )}

      {status === "done" && (
        <Typography mt={2} color="success.main">
          ✅ Project launched!
        </Typography>
      )}
    </Paper>
  );
}
