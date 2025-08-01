"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormHelperText,
  Typography,
  MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InputParams } from "@/models/workflow";
import FTextField from "@/components/form/FTextField";
import DragDropUploader from "./DragDropUploader";
import FCheckbox from "./form/FCheck";

interface ParamAccordionGroupProps {
  groupKey: string;
  groupParams: InputParams[];
}

export default function ParamAccordionGroup({
  groupKey,
  groupParams
}: ParamAccordionGroupProps) {
  return (
    <Accordion
      sx={{
        mb: 2,
        borderRadius: 2,
        "&:before": {
          display: "none"
        },
        background: "transparent"
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {groupKey
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {groupParams.map((param) => {
          switch (param.type) {
            case "boolean":
              return (
                <FCheckbox
                  key={param.key}
                  name={param.key}
                  label={param.key}
                  sx={{ mb: 1 }}
                />
              );
            default:
              if (param.enum.length > 0) {
                return (
                  <FTextField
                    key={param.key}
                    name={param.key}
                    label={
                      param.key.charAt(0).toUpperCase() + param.key.slice(1)
                    }
                    required={param.required}
                    defaultValue={param.enum[0]}
                    select
                    helperText={param.help_text}
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {param.enum.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </FTextField>
                );
              }
              if (param.key === "input") {
                return (
                  <FormControl key={param.key}>
                    <label>
                      {param.key.charAt(0).toUpperCase() + param.key.slice(1)}
                    </label>
                    <FormHelperText>{param.help_text}</FormHelperText>
                    <DragDropUploader />
                  </FormControl>
                );
              }
              return (
                <FTextField
                  key={param.key}
                  name={param.key}
                  label={param.key}
                  defaultValue={param.default}
                  required={param.required}
                  rule={{
                    required: param.required
                      ? `${param.key} is required`
                      : false,
                    pattern: param.pattern
                      ? {
                          value: new RegExp(param.pattern),
                          message: `${param.key} does not match required pattern`
                        }
                      : undefined
                  }}
                  helperText={param.description}
                  sx={{ mb: 2 }}
                  size="small"
                  type={param.type === "integer" ? "number" : "text"}
                />
              );
          }
        })}
      </AccordionDetails>
    </Accordion>
  );
}
