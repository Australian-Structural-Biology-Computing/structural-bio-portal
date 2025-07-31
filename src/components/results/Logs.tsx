import { LaunchLogs } from "@/models/workflow";
import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import Ansi from "ansi-to-html";

export default function Logs({ log }: { log: LaunchLogs }) {
  const logContent = log.entries.join("\n");
  const logMessage = log.message;
  const ansiToHtml = new Ansi();
  const html = ansiToHtml.toHtml(logContent);

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
            // color: "#fff",
            fontFamily: "monospace",
            p: 2,
            whiteSpace: "pre-wrap"
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </>
  );
}
