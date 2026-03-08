import { useEffect } from "react";
import {
  Modal,
  Divider,
  BlockStack,
  InlineStack,
  Spinner,
} from "@shopify/polaris";
import { useFetchTimerById } from "../hooks/queries/useTimerQueries";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { timerSchema } from "../../validators/timer.schema";

import { FormTextField } from "../components/common/FormTextField";
import { FormSelect } from "../components/common/FormSelect";
import { FormColorPicker } from "../components/common/FormColorPicker";

const defaultForm = {
  title: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  description: "",
  displayOptions: {
    backgroundColor: "#000000",
    fontSize: "16px",
    position: "bottom",
  },
  urgencySettings: {
    type: "notification_banner",
  },
};

export function TimerModal({ open, onClose, onSave, loading, id }) {
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(timerSchema),
    defaultValues: defaultForm,
  });

  const { data: timerReponseData, isLoading } = useFetchTimerById(id);

  useEffect(() => {
    const timerDetails = timerReponseData?.timer;

    if (timerDetails) {
      const start = timerDetails.startDate
        ? new Date(timerDetails.startDate)
        : null;

      const end = timerDetails.endDate ? new Date(timerDetails.endDate) : null;

      reset({
        ...defaultForm,
        ...timerDetails,
        startDate: start ? start.toISOString().split("T")[0] : "",
        startTime: start ? start.toTimeString().slice(0, 5) : "",
        endDate: end ? end.toISOString().split("T")[0] : "",
        endTime: end ? end.toTimeString().slice(0, 5) : "",
        displayOptions: {
          ...defaultForm.displayOptions,
          ...(timerDetails.displayOptions || {}),
        },
        urgencySettings: {
          ...defaultForm.urgencySettings,
          ...(timerDetails.urgencySettings || {}),
        },
      });
    } else {
      reset(defaultForm);
    }
    return () => {
      reset(defaultForm);
    };
  }, [timerReponseData, open, reset]);

  const onSubmit = (data) => {
    const startDate = new Date(
      `${data.startDate}T${data.startTime || "00:00"}`,
    ).toISOString();

    const endDate = new Date(
      `${data.endDate}T${data.endTime || "00:00"}`,
    ).toISOString();

    onSave(
      {
        ...data,
        startDate,
        endDate,
      },
      id,
    );
  };

  const sizeOptions = [
    { label: "Small", value: "14px" },
    { label: "Medium", value: "16px" },
    { label: "Large", value: "20px" },
    { label: "Extra Large", value: "24px" },
  ];

  const positionOptions = [
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Inline", value: "inline" },
  ];

  const urgencyOptions = [
    { label: "Notification banner", value: "notification_banner" },
    { label: "Color pulse", value: "color_pulse" },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={timerReponseData ? "Edit Timer" : "Create New Timer"}
      primaryAction={{
        content: timerReponseData ? "Save changes" : "Create timer",
        onAction: handleSubmit(onSubmit),
        loading,
      }}
      secondaryActions={[{ content: "Cancel", onAction: onClose }]}
    >
      <Modal.Section>
        {isLoading ? (
          <BlockStack gap="400" align="center" inlineAlign="center">
            <Spinner />
          </BlockStack>
        ) : (
          <BlockStack gap="400">
            <FormTextField
              name="title"
              control={control}
              label="Timer name *"
            />

            <InlineStack gap="300">
              <div style={{ flex: 1 }}>
                <FormTextField
                  name="startDate"
                  control={control}
                  label="Start date"
                  type="date"
                />
              </div>

              <div style={{ flex: 1 }}>
                <FormTextField
                  name="startTime"
                  control={control}
                  label="Start time"
                  type="time"
                />
              </div>
            </InlineStack>

            <InlineStack gap="300">
              <div style={{ flex: 1 }}>
                <FormTextField
                  name="endDate"
                  control={control}
                  label="End date"
                  type="date"
                />
              </div>

              <div style={{ flex: 1 }}>
                <FormTextField
                  name="endTime"
                  control={control}
                  label="End time"
                  type="time"
                />
              </div>
            </InlineStack>

            <FormTextField
              name="description"
              control={control}
              label="Promotion description"
              multiline={4}
            />

            <Divider />

            <FormColorPicker
              name="displayOptions.backgroundColor"
              control={control}
              label="Timer background color"
            />

            <InlineStack gap="300">
              <div style={{ flex: 1 }}>
                <FormSelect
                  name="displayOptions.fontSize"
                  control={control}
                  label="Timer size"
                  options={sizeOptions}
                />
              </div>

              <div style={{ flex: 1 }}>
                <FormSelect
                  name="displayOptions.position"
                  control={control}
                  label="Timer position"
                  options={positionOptions}
                />
              </div>
            </InlineStack>

            <FormSelect
              name="urgencySettings.type"
              control={control}
              label="Urgency notification"
              options={urgencyOptions}
            />
          </BlockStack>
        )}
      </Modal.Section>
    </Modal>
  );
}
