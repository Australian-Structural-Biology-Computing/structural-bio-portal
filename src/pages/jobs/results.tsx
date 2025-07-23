
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
  const [, setLaunchInfo] = useState<LaunchDetails>();
  const [params, setParams] = useState<Record<string, any>>();
  const [logs, setLogs] = useState<LaunchLogs>();
  const [file, setFile] = useState<any>();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!workflowId) return;
    const fetchLaunchDetails = async () => {
      try {
        setStatus("loading");
        const res: LaunchDetails = await launchDetails(workflowId);
        const resLogs: LaunchLogs = await launchLog(workflowId);
        // const resFile: any = await downloadFile(workflowId);
        setLaunchInfo(res);
        setParams(res.params);
        setLogs(resLogs);
        // setFile(resFile);
        setStatus("done");
      } catch (error: any) {
        setStatus("error");
        setErrorMsg(error);
      }
    };
    fetchLaunchDetails();
  }, [workflowId]);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
      {status === "done" && (
        <>
          <CustomTabPanel value={value} index={0}>
            MultiQC Report
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Typography variant="h4">Binder</Typography>
            <Files file={file} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {params && <Settings configText={params} />}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            {logs && <Logs log={logs} />}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            Citation
          </CustomTabPanel>
        </>
      )}
      {status === "loading" && (
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
      )}
      {status === "error" && (
        <Alert severity="error">
          Error:{" "}
          {typeof errorMsg === "string" ? errorMsg : "Something went wrong!"}
        </Alert>
      )}
    </Box>
  );
}
