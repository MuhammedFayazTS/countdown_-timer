import { ColorPicker, Text, BlockStack } from "@shopify/polaris";
import { useController } from "react-hook-form";

/* HEX → HSB */
function hexToHsb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let hue = 0;

  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
  }

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const saturation = max === 0 ? 0 : d / max;
  const brightness = max;

  return { hue, saturation, brightness };
}

/* HSB → HEX */
function hsbToHex({ hue, saturation, brightness }) {
  const c = brightness * saturation;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = brightness - c;

  let r = 0,
    g = 0,
    b = 0;

  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function FormColorPicker({ name, control, label }) {
  const { field } = useController({ name, control });

  const color = hexToHsb(field.value || "#000000");

  const handleChange = (newColor) => {
    field.onChange(hsbToHex(newColor));
  };

  return (
    <BlockStack gap="200">
      {label && (
        <Text variant="bodyMd" fontWeight="medium" as="p">
          {label}
        </Text>
      )}

      <ColorPicker color={color} onChange={handleChange} />

      <Text tone="subdued">{field.value}</Text>
    </BlockStack>
  );
}
