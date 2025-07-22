'use client';
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { listRuns } from "@/controllers/listRuns";
import { RunInfo } from "@/models/workflow";
import { cancelWorkflow } from "@/controllers/cancelWorkflow";

export default function MyRuns() {
  const [runs, setRuns] = React.useState<RunInfo[]>([]);

  const fetchRuns = async () => {
    const result = await listRuns();
    const Runs: RunInfo[] = result.map((run) => ({
      id: run?.workflow.id,
      run: run?.workflow.runName,
      workflow: run?.workflow.repository
        ? run?.workflow.repository
        : run?.workflow.projectName,
      status: run?.workflow.status,
      date: new Date(run?.workflow.dateCreated).toLocaleString(),
      cancel: ""
    }));
    setRuns(Runs);
  };
  const handleCancel = async (workflowId: string) => {
    try {
      await cancelWorkflow(workflowId);
      await fetchRuns();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
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
          onClick={() => {
            handleCancel(params.row.id);
          }}
        >
          Cancel
        </Button>
      )
    }
  ];
  return (
    <Box sx={{ hieght: "100vh", width: "100%" }}>
      <DataGrid
        rows={runs}
        columns={columns}
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
    </Box>
  );
}
