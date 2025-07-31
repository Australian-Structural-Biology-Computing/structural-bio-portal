import { launchDetails } from "@/controllers/launchDetails";
import { LaunchDetails, LaunchLogs } from "@/models/workflow";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Settings from "@/components/results/Settings";
import Logs from "@/components/results/Logs";
import { launchLog } from "@/controllers/launchLogs";
import { Alert, CircularProgress, Typography } from "@mui/material";
import Files from "@/components/results/Files";
import { downloadFile } from "@/controllers/downloadFile";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`id-${index}`}
      aria-labelledby={`label-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `id-${index}`,
    "aria-controls": `label-${index}`
  };
}
export default function ResultsPage() {
  const router = useRouter();
  const id = router?.query?.id;
  const workflowId = Array.isArray(id) ? id[0] : id;
  const [params, setParams] = useState<Record<string, any>>();
  const [logs, setLogs] = useState<LaunchLogs>();
  const [resultFile, setResultFile] = useState<any>();
  const [files, setFiles] = useState<any>();
  const [statusLaunch, setStatusLaunch] = useState<
    "idle" | "loading" | "done" | "error"
  >("loading");
  const [statusLogs, setStatusLog] = useState<
    "idle" | "loading" | "done" | "error"
  >("loading");
  const [statusFiles, setStatusFiles] = useState<
    "idle" | "loading" | "done" | "error"
  >("loading");
  const isAnyError = [statusLaunch, statusLogs, statusFiles].includes("error");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!workflowId) return;

    launchDetails(workflowId)
      .then((res) => {
        setStatusLaunch("loading");
        setParams(res.params);
        setStatusLaunch((prev) => (params ? "done" : prev));
      })
      .catch((error) => {
        setStatusLaunch("error");
        setErrorMsg(error?.message || "Failed to load launch details");
      });

    launchLog(workflowId)
      .then((resLogs) => {
        setStatusLog("loading");
        setLogs(resLogs);
        setStatusLog((prev) => (logs ? "done" : prev));
      })
      .catch((error) => {
        setStatusLog("error");
        setErrorMsg(error?.message || "Failed to load logs");
      });

    downloadFile(workflowId)
      .then((fileRes) => {
        setStatusFiles("loading");
        setResultFile(fileRes.result);
        setFiles(fileRes.files);
        setStatusFiles("done");
      })
      .catch((error) => {
        setStatusFiles("error");
        setErrorMsg(error?.message || "Failed to load files");
      });
  }, [workflowId]);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const LoadingElement = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={3}
    >
      <CircularProgress />
      <Typography variant="body1">Loading you job details...</Typography>
    </Box>
  );
  console.log("status: ", statusLaunch, statusLogs, statusFiles);
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Results" {...a11yProps(0)} />
          <Tab label="Files" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
          <Tab label="Logs" {...a11yProps(3)} />
          <Tab label="Citation" {...a11yProps(4)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        {statusFiles === "loading" && <LoadingElement />}
        {statusFiles === "done" && resultFile && <Files file={resultFile} />}
        {statusFiles === "done" && !resultFile && (
          <Box sx={{ padding: 3 }}>
            <Typography variant="body1">
              No result file found for this workflow.
            </Typography>
          </Box>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {statusFiles === "loading" && <LoadingElement />}
        {statusFiles === "done" &&
          files.length > 0 &&
          files.map((file: string) => <Files file={file} />)}
        {statusFiles === "done" && files.length === 0 && (
          <Box sx={{ padding: 3 }}>
            <Typography variant="body1">
              No files found for this workflow.
            </Typography>
          </Box>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {statusLaunch === "loading" && <LoadingElement />}
        {statusLaunch === "done" && <Settings configText={params} />}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {statusLogs === "loading" && <LoadingElement />}
        {statusLogs === "done" && logs && <Logs log={logs} />}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Citation
      </CustomTabPanel>
      {isAnyError && (
        <Alert severity="error">
          Error:{" "}
          {typeof errorMsg === "string" ? errorMsg : "Something went wrong!"}
        </Alert>
      )}
    </Box>
  );
}
