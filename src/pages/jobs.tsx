'use client';
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "run",
    headerName: "Run name",
    width: 150,
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
    renderCell: () => <Button variant="outlined">Cancel</Button>
  }
];

const rows = [
  { id: 1, run: "hello-Anne", workflow: "BindFlow", status: "Canceled", date: "2025-03-07 2:00 PM", cancel: "" }]


export default function MyRuns() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5
            }
          }
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
