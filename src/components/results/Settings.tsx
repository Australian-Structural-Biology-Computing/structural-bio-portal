import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Settings({
  configText = {}
}: {
  configText?: Record<string, any>;
}) {
  return (
    <Box
      sx={{
        height: "80vh",
        overflowY: "auto",
        borderRadius: 2,
        backgroundColor: "#050505ff",
        color: "#fff",
        p: 2,
        whiteSpace: "pre-wrap"
      }}
    >
      {Object.entries(configText).map(([key, value]) => (
        <Typography
          key={key}
          fontFamily={"monospace"}
          marginBottom={1}
          fontStyle={"bold"}
        >
          <Box component="span" fontWeight="bold" color="#11c611ff">
            {key}:
          </Box>{" "}
          {String(value)}
        </Typography>
      ))}
    </Box>
  );
}