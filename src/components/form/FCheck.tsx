import { useFormContext, Controller } from "react-hook-form";
import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps
} from "@mui/material";

type FCheckboxProps = {
  name: string;
} & Omit<FormControlLabelProps, "control">;

function FCheckbox({ name, ...other }: FCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false} // required for boolean fields
      render={({ field: { value, onChange, ...field } }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={!!value} // bind checked explicitly
              onChange={(e) => onChange(e.target.checked)} // set value as boolean
            />
          }
          {...other}
        />
      )}
    />
  );
}

export default FCheckbox;
