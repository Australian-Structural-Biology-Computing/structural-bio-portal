import * as React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { CardHeader, CardMedia, Chip } from "@mui/material";
import { useRouter } from "next/router";

const workflows = [
  {
    id: 1,
    title: "BindFlow",
    href: "/runs/bindflow",
    description:
      "Simple binder design pipeline using AlphaFold2 backpropagation, MPNN, and PyRosetta. Select your target and let the script do the rest of the work and finish once you have enough designs to order ...",
    github:
      "https://github.com/Australian-Structural-Biology-Computing/bindflow.git",
    keywords: ["Protein design", "Antibody design", "Drug design"]
  },
  {
    id: 2,
    title: "AlphaFold",
    href: "/runs/bindflow",
    description: "This is the workflow 1 description",
    github: "https://github.com/nextflow-io/nextflow.git",
    keywords: ["Protein design", "Antibody design", "Drug design"]
  },
  {
    id: 3,
    title: "ColabFold",
    href: "/runs/bindflow",
    description: "This is the workflow 2 description",
    github: "https://github.com/nextflow-io/nextflow.git",
    keywords: ["Protein design", "Antibody design", "Drug design"]
  }
];

export default function StartProject() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = React.useState(0);
  const handleStartButton = (workflow: {href: string}) => {
    router.push(workflow.href);
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
        gap: 2
      }}
    >
      {workflows.map((workflow, index) => (
        <Card sx={{ maxWidth: 500 }}>
          <CardActionArea
            onClick={() => handleStartButton(workflow)}
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
            <CardHeader title={workflow.title} />
            <CardContent>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {workflow.keywords.map((kword) => (
                  <Chip variant="outlined" label={kword} />
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
      ))}
    </Box>
  );
}