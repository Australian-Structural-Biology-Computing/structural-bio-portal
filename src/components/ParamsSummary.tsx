import { Box, Typography } from "@mui/material";

export default function ParamsSummary({
  paramKey,
  value
}: {
  paramKey: string;
  value: string;
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.primary">
        {paramKey
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {value}
      </Typography>
    </Box>
  );
}
