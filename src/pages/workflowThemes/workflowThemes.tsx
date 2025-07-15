import * as React from "react";
// import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { CardHeader, CardMedia, Chip } from "@mui/material";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/DBContext";
import { PreconfigContext, ThemesContext, Workflows } from "@/models/workflow";

export default function PreConfigWorkflows() {
    const router = useRouter();
    const [selectedCard, setSelectedCard] = React.useState<string>("");

    const context = useWorkflows();
    const themes = context?.themes;
  
    const themesId = router?.query?.id;
    // Get theme info from theme query
    const theme = themes?.find(
      (t: ThemesContext) => Object.keys(t)[0] === themesId
    );
    const PreConfig = theme ? Object.values(theme)[0] as PreconfigContext : undefined;
    const PreConfigKeys = PreConfig?.key.split(",")
    const TextClean = (text: string) => {
        return text
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 1fr))",
        gap: 2
      }}
    >
      <Typography variant="h2">
        {theme && TextClean(Object.keys(theme)[0])}
      </Typography>
      <Typography>{PreConfig && PreConfig.description}</Typography>
      <Typography variant="h4">Pre-config workflows</Typography>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
          gap: 2
        }}
      >
        {PreConfigKeys &&
          PreConfigKeys.map((wf) => (
            <Card sx={{ maxWidth: 500 }} key={wf}>
              <CardActionArea
                onClick={() => {
                  setSelectedCard(wf);
                  router.push({
                    pathname: "preconfig",
                    query: { id: wf }
                  });
                }}
                data-active={selectedCard === wf}
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
                <CardHeader title={TextClean(wf)} />
              </CardActionArea>
            </Card>
          ))}
      </Box>
    </Box>
  );
}