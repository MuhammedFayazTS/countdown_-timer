import { TextField } from "@shopify/polaris";
// import { SearchIcon } from "@shopify/polaris-icons";

export function SearchInput({
  value = "",
  onChange,
  placeholder = "Search…",
  label,
  labelHidden = true,
}) {
  return (
    <TextField
      label={label}
      labelHidden={labelHidden}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      //   prefix={SearchIcon}
      autoComplete="off"
      clearButton
      onClearButtonClick={() => onChange("")}
    />
  );
}
