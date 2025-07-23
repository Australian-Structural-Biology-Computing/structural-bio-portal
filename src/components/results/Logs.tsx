import { LaunchLogs } from "@/models/workflow";
import { Alert } from "@mui/material";
import { Box } from "@mui/system";

export default function Logs({
  log
}: {
  log?: LaunchLogs;
    }) {
    console.log(log)
    const logContent = log?.entries.join("\n");
    const logMessage = log?.message
    return (
      <>
        {logContent && logContent.length > 0 ? (
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
            {logContent}
          </Box>
        ) : (
          <Alert severity="error">{logMessage}</Alert>
        )}
      </>
    );
}
