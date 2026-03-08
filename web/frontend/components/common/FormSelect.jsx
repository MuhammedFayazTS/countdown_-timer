import { Select } from "@shopify/polaris";
import { useController } from "react-hook-form";

export function FormSelect({ name, control, label, options, ...props }) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <Select
      label={label}
      options={options}
      value={field.value}
      onChange={field.onChange}
      error={error?.message}
      {...props}
    />
  );
}
