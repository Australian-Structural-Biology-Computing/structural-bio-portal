import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";

export default function ParamsSummary({
  paramKey,
  value,
  onChange
}: {
  paramKey: string;
  value: string;
  onChange: (newVal: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    if (!editMode) {
      setTempValue(value);
    }
  }, [value, editMode]);

  const handleToggleEdit = () => {
    if (editMode) {
      onChange(tempValue);
    }
    setEditMode(!editMode);
  };

  return (
    <>
      <ListItemIcon>
        {paramKey
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())}
      </ListItemIcon>
      <Box boxShadow={1} width={"100%"} padding={1}>
        <ListItem
          key={value}
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
              editMode ? (
                <TextField
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  size="small"
                />
              ) : (
                `${value}`
              )
            }
          />
        </ListItem>
      </Box>
    </>
  );
}
