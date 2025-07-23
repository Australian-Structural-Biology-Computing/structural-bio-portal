import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Settings({ configText = {} }: { configText?: Record<string, any> }) {
    console.log(configText)
    return (
      <Box
        sx={{
          height: "80vh",
          overflowY: "auto",
          borderRadius: 2,
          backgroundColor: "#d2cdcdff",
          p: 2,
          whiteSpace: "pre-wrap"
        }}
      >
        {Object.entries(configText).map(([key, value]) => (
          <Typography key={key}>
            {key}: {String(value)}
          </Typography>
        ))}
      </Box>
    );
}