import { LaunchLogs } from "@/models/workflow";
import { Alert } from "@mui/material";
import { Box } from "@mui/system";

export default function Logs({ log }: { log: LaunchLogs }) {
  const logContent = log.entries.join("\n");
  const logMessage = log.message;
  return (
    <>
      {logMessage && logMessage.length > 0 ? (
        <Alert severity="error">{logMessage}</Alert>
      ) : (
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
          <pre>{logContent}</pre>
        </Box>
      )}
    </>
  );
}
