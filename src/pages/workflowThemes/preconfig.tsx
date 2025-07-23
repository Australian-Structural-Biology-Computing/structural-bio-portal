import * as React from "react";
// import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Alert, CardHeader, CardMedia, Chip } from "@mui/material";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/DBContext";

export default function PreConfigWorkflows() {
  const router = useRouter();
  const themesId = router.query.id;
  const [selectedCard, setSelectedCard] = React.useState(0);

  const context = useWorkflows();
  const allWorkflows = context.workflows;

  const workflows = allWorkflows
    ? allWorkflows.filter((wf) => wf.preconfig === themesId)
    : [];
  console.log(workflows);
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
        gap: 2
      }}
    >
      {workflows.length > 0 ? (
        workflows.map((workflow, index) => (
          <Card sx={{ maxWidth: 500 }} key={workflow.id}>
            <CardActionArea
              onClick={() => {
                setSelectedCard(index);
                router.push({
                  pathname: "/runs/runWorkflow",
                  query: { id: workflow.id }
                });
              }}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                "&[data-active]": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.selectedHover"
                  }
                }
              }}
            >
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/workflows.jpeg"
              />
              <CardHeader
                title={workflow.title
                  .replace(/[-_]/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              />
              <CardContent>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {workflow.keywords?.map((kword) => (
                    <Chip variant="outlined" label={kword} key={kword} />
                  ))}
                </Box>
              </CardContent>
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="body2" color="text.secondary">
                  {workflow.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))
      ) : (
        <Alert severity="error">
          There is no workflow available! Please choose other pre-config
          workflows group!
        </Alert>
      )}
    </Box>
  );
}