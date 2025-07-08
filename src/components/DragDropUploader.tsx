"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Paper, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function DragDropUploader() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"]
    }
  });

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
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
    </Paper>
  );
}
