import {
  InlineStack,
  BlockStack,
  Text,
  Badge,
  Button,
  Box,
  Divider,
} from "@shopify/polaris";
import { useTranslation } from "react-i18next";

export function TimerRowItem({
  timer,
  onEdit,
  onDelete = () => {},
}) {
  const { t } = useTranslation();

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  // TODO: update ui as in the wireframe
  return (
    <Box paddingBlock="4">
      <InlineStack align="space-between" blockAlign="start" gap="2">
        <BlockStack gap="1">
          <Text variant="bodyMd" fontWeight="semibold" as="p">
            {timer.title}
          </Text>

          {timer.description && (
            <Text variant="bodySm" tone="subdued" as="p">
              {timer.description}
            </Text>
          )}

          <Text variant="bodySm" tone="subdued" as="p">
            {t("Start")}: {formatDate(timer.startDate)}
          </Text>

          <Text variant="bodySm" tone="subdued" as="p">
            {t("End")}: {formatDate(timer.endDate)}
          </Text>
        </BlockStack>

        <InlineStack gap="2" blockAlign="center">
          <Badge tone={timer.isActive ? "success" : "critical"}>
            {timer.isActive ? "Active" : "Inactive"}
          </Badge>

          <Button size="slim" onClick={() => onEdit(timer._id)}>
            {t("Edit")}
          </Button>

          <Button
            size="slim"
            tone="critical"
            onClick={() => onDelete(timer._id)}
          >
            {t("Delete")}
          </Button>
        </InlineStack>
      </InlineStack>

      <Box paddingBlockStart="4">
        <Divider />
      </Box>
    </Box>
  );
}
