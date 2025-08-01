import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  MenuItem,
  Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import FTextField from "./form/FTextField";
import FCheckbox from "./form/FCheck";

export default function ParamsSummary({
  paramKey,
  value,
  onChange,
  methods,
  type,
  enumOptions = [],
  help_text,
  required,
  pattern,
  description
}: {
  paramKey: string;
  value: any;
  onChange: (newVal: any) => void;
  methods: UseFormReturn<any>;
  type?: string;
  enumOptions?: any[];
  help_text?: string;
  required?: boolean;
  pattern?: string;
  description?: string;
}) {
  const [editMode, setEditMode] = useState(false);
  const error = methods.formState.errors[paramKey]?.message;

  const handleToggleEdit = async () => {
    if (editMode) {
      const isValid = await methods.trigger(paramKey);
      if (isValid) {
        const updatedValue = methods.getValues(paramKey);
        onChange(updatedValue);
        setEditMode(false);
      }
    } else {
      setEditMode(true);
    }
  };

  let inputField;
  if (editMode) {
    switch (type) {
      case "boolean":
        inputField = (
          <FCheckbox
            key={paramKey}
            name={paramKey}
            label={paramKey}
            sx={{ mb: 1 }}
          />
        );
        break;

      default:
        inputField = (
          <FTextField
            key={paramKey}
            name={paramKey}
            defaultValue={value}
            label={paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
            required={required}
            select={enumOptions.length > 0}
            helperText={help_text || description}
            size="small"
            sx={{ mb: 2 }}
            rule={{
              required: required ? `${paramKey} is required` : false,
              pattern: pattern
                ? {
                    value: new RegExp(pattern),
                    message: `${paramKey} does not match required pattern`
                  }
                : undefined
            }}
            type={type === "integer" ? "number" : "text"}
          >
            {enumOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </FTextField>
        );
    }
  } else {
    inputField = (
      <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
        {String(value)}
      </Typography>
    );
  }

  return (
    <Box boxShadow={1} width={"100%"} padding={1} mb={2}>
      <ListItem
        key={paramKey}
        disableGutters
        sx={{ minHeight: 40 }}
        secondaryAction={
          <IconButton
            aria-label={editMode ? "Save" : "Edit"}
            onClick={handleToggleEdit}
            sx={{ ml: 1 }}
          >
            {editMode ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        }
      >
        <ListItemText
          primary={
            <Box>
              <Typography fontWeight="bold" component="span" mr={1}>
                {paramKey
                  .replace(/[-_]/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                :
              </Typography>
              {inputField}
              {editMode && error && (
                <Typography variant="caption" color="error">
                  {String(error)}
                </Typography>
              )}
            </Box>
          }
        />
      </ListItem>
    </Box>
  );
}
