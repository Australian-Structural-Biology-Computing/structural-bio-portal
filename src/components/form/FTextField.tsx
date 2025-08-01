import { useFormContext, Controller, RegisterOptions } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
type FTextFieldProps = {
  name: string;
  defaultValue?: any;
  rule?: RegisterOptions;
} & TextFieldProps;

function FTextField({ name, defaultValue, rule, ...other }: FTextFieldProps) {
  const { control, formState } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rule}
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
