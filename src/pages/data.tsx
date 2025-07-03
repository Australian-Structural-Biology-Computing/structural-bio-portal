import DragDropUploader from "../components/DragDropUploader";
import { Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Data
      </Typography>
      <DragDropUploader />
    </>
  );
}
