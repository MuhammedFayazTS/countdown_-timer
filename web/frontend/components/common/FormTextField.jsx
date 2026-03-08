import { TextField } from "@shopify/polaris";
import { useController } from "react-hook-form";

export function FormTextField({
  name,
  control,
  label,
  multiline,
  type = "text",
  autoComplete = "off",
  ...props
}) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <TextField
      label={label}
      type={type}
      multiline={multiline}
      autoComplete={autoComplete}
      value={field.value || ""}
      onChange={field.onChange}
      error={error?.message}
      {...props}
    />
  );
}
