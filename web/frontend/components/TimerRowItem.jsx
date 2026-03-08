import {
  InlineStack,
  BlockStack,
  Text,
  Badge,
  Button,
  Box,
  Divider,
  Popover,
  ActionList,
} from "@shopify/polaris";
import { MenuHorizontalIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTimerStatus } from "../utils/timerUtils";

export function TimerRowItem({ timer, onEdit, onDelete = () => {} }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);

  const togglePopover = () => setActive((prev) => !prev);

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

  const activator = (
    <Button
      icon={MenuHorizontalIcon}
      variant="tertiary"
      size="slim"
      onClick={togglePopover}
      accessibilityLabel="More actions"
    />
  );

  const status = getTimerStatus(timer);

  return (
    <Box paddingBlock="4">
      <InlineStack align="space-between" blockAlign="start" gap="200">
        <BlockStack gap="100">
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

        <InlineStack gap="300" blockAlign="center">
          <Badge tone={status.tone}>{status.label}</Badge>
          <Popover
            active={active}
            activator={activator}
            autofocusTarget="first-node"
            onClose={togglePopover}
          >
            <ActionList
              items={[
                {
                  content: t("Edit"),
                  onAction: () => onEdit(timer._id),
                },
                {
                  content: t("Delete"),
                  tone: "critical",
                  onAction: () => onDelete(timer._id),
                },
              ]}
            />
          </Popover>
        </InlineStack>
      </InlineStack>

      <Box paddingBlockStart="400">
        <Divider />
      </Box>
    </Box>
  );
}
