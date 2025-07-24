'use client';
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { listRuns } from "@/controllers/listRuns";
import { RunInfo } from "@/models/workflow";
import { cancelWorkflow } from "@/controllers/cancelWorkflow";

export default function MyRuns() {
  const [runs, setRuns] = React.useState<RunInfo[]>([]);
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [canceling, setCanceling] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const handleRowClick = (params: GridRowParams) => {
    const id = params.row.id;
    Router.push({ pathname: "/jobs/results", query: { id: id } });
  };

  const fetchRuns = async () => {
    const result = await listRuns();
    const Runs: RunInfo[] = result.map((run) => ({
      id: run.workflow.id,
      run: run.workflow.runName,
      workflow: run.workflow.repository
        ? run.workflow.repository
        : run.workflow.projectName,
      status: run.workflow.status,
      date: new Date(run?.workflow.dateCreated).toLocaleString(),
      cancel: ""
    }));
    setRuns(Runs);
  };

  React.useEffect(() => {
    fetchRuns();
  }, []);

  const columns: GridColDef<RunInfo>[] = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "run",
      headerName: "Run name",
      width: 200,
      editable: true
    },
    {
      field: "workflow",
      headerName: "Workflow",
      width: 150,
      editable: true
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      editable: true
    },
    {
      field: "date",
      headerName: "Started at",
      width: 160
    },
    {
      field: "cancel",
      headerName: "Cancel",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          disabled={!["SUBMITTED", "RUNNING"].includes(params.row.status)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId(params.row.id);
            setOpenDialog(true);
          }}
        >
          Cancel
        </Button>
      )
    }
  ];
  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <Backdrop
        open={canceling}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>{" "}
      {status === "error" && <Alert>Error: {errorMsg}</Alert>}
      {(status === "idle" || "done") && (
        <>
          <DataGrid
            rows={runs}
            columns={columns}
            onRowClick={handleRowClick}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10
                }
              }
            }}
            pageSizeOptions={[10]}
            checkboxSelection
          />
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogContent>
              Are you sure you want to cancel this workflow?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>No</Button>
              <Button
                onClick={async () => {
                  if (selectedId) {
                    setCanceling(true);
                    try {
                      await cancelWorkflow(selectedId);
                      await fetchRuns();
                      setStatus("done");
                    } catch (error) {
                      console.error("Cancel failed:", error);
                      setStatus("error");
                      setErrorMsg(`ERROR: ${error}`);
                    } finally {
                      setSelectedId(null);
                      setOpenDialog(false);
                      setCanceling(false);
                    }
                  }
                }}
                color="info"
              >
                Yes, Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
