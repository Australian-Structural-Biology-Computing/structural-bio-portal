import { LaunchLogs } from "@/models/workflow";
import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import Ansi from "ansi-to-html";

export default function Logs({ log }: { log: LaunchLogs }) {
  const logContent = log.entries.join("\n");
  const logMessage = log.message;
const ansiToHtml = new Ansi({
  fg: "#000000", // Default foreground color
  bg: "#ffffff", // Default background color
  colors: {
    2: "#11c611ff", // ANSI green → bright green
    4: "#ffffff" // ANSI blue → white
  }
});
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
          backgroundColor: "#050505ff",
          color: "#fff",
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
