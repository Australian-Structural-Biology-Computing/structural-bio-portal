import {Card, CardContent, CardMedia } from "@mui/material";
import { Box } from "@mui/system";

export default function Files({ file }: { file: string }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "500px",
        overflow: "hidden",
        borderRadius: 1,
        position: "relative"
      }}
    >
      <Box
        component="iframe"
        src={file}
        title="HTML Report"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "top left",
          transform: "scale(0.5)", // adjust the scale as needed
          width: "200%", // match with scale factor (1 / 0.5 = 2)
          height: "200%",
          border: "none"
        }}
      />
    </Box>
  );
}
