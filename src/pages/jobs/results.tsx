
import { launchDetails } from "@/controllers/launchDetails";
import { Typography } from "@mui/material";
import { Box} from "@mui/system";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const router = useRouter();
  const id = router?.query?.id
  const workflowId = Array.isArray(id) ? id[0] : id;

    const [details, setDetails] = useState<any>(null);


  useEffect(() => {
    if (!workflowId) return;

    launchDetails(workflowId)
      .then((res) => setDetails(res))
      .catch((err) => console.error("Error loading launch details", err));
  }, [workflowId]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
          <Typography>{workflowId}</Typography>
    </Box>
  );
}
