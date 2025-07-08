import { useFormContext, Controller } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
type FTextFieldProps = {
    name: string;
} & TextFieldProps

function FTextField({ name, ...other }: FTextFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}

export default FTextField;