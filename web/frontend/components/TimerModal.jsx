import { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Select,
  Text,
  Divider,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";

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

// TODO: update with react hook form + zod
export function TimerModal({ open, onClose, onSave, loading, editTimer }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTimer) {
      const start = editTimer.startDate ? new Date(editTimer.startDate) : null;
      const end = editTimer.endDate ? new Date(editTimer.endDate) : null;
      setForm({
        ...defaultForm,
        ...editTimer,
        startDate: start ? start.toISOString().split("T")[0] : "",
        startTime: start ? start.toTimeString().slice(0, 5) : "",
        endDate: end ? end.toISOString().split("T")[0] : "",
        endTime: end ? end.toTimeString().slice(0, 5) : "",
        displayOptions: {
          ...defaultForm.displayOptions,
          ...(editTimer.displayOptions || {}),
        },
        urgencySettings: {
          ...defaultForm.urgencySettings,
          ...(editTimer.urgencySettings || {}),
        },
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editTimer, open]);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setDisplay = (key, value) =>
    setForm((prev) => ({
      ...prev,
      displayOptions: { ...prev.displayOptions, [key]: value },
    }));

  const setUrgency = (key, value) =>
    setForm((prev) => ({
      ...prev,
      urgencySettings: { ...prev.urgencySettings, [key]: value },
    }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Timer name is required";
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";
    if (form.startDate && form.endDate) {
      const start = new Date(`${form.startDate}T${form.startTime || "00:00"}`);
      const end = new Date(`${form.endDate}T${form.endTime || "00:00"}`);
      if (end <= start) errs.endDate = "End must be after start";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const startDate = new Date(
      `${form.startDate}T${form.startTime || "00:00"}`,
    ).toISOString();
    const endDate = new Date(
      `${form.endDate}T${form.endTime || "00:00"}`,
    ).toISOString();
    onSave({ ...form, startDate, endDate });
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
      title={editTimer ? "Edit Timer" : "Create New Timer"}
      primaryAction={{
        content: editTimer ? "Save changes" : "Create timer",
        onAction: handleSave,
        loading,
      }}
      secondaryActions={[{ content: "Cancel", onAction: onClose }]}
    >
      <Modal.Section>
        <BlockStack gap="4">
          <TextField
            label="Timer name *"
            value={form.title}
            onChange={(v) => set("title", v)}
            placeholder="Enter timer name"
            error={errors.title}
            autoComplete="off"
          />

          <InlineStack gap="3" align="start" blockAlign="start">
            <div style={{ flex: 1, minWidth: 0 }}>
              <TextField
                label="Start date"
                type="date"
                value={form.startDate}
                onChange={(v) => set("startDate", v)}
                error={errors.startDate}
                autoComplete="off"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TextField
                label="Start time"
                type="time"
                value={form.startTime}
                onChange={(v) => set("startTime", v)}
                autoComplete="off"
              />
            </div>
          </InlineStack>

          <InlineStack gap="3" align="start" blockAlign="start">
            <div style={{ flex: 1, minWidth: 0 }}>
              <TextField
                label="End date"
                type="date"
                value={form.endDate}
                onChange={(v) => set("endDate", v)}
                error={errors.endDate}
                autoComplete="off"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <TextField
                label="End time"
                type="time"
                value={form.endTime}
                onChange={(v) => set("endTime", v)}
                autoComplete="off"
              />
            </div>
          </InlineStack>

          <TextField
            label="Promotion description"
            value={form.description}
            onChange={(v) => set("description", v)}
            placeholder="Enter promotion details"
            multiline={4}
            autoComplete="off"
          />

          <Divider />

          <BlockStack gap="2">
            <Text variant="bodyMd" fontWeight="medium" as="p">
              Timer background color
            </Text>
            <InlineStack gap="3" blockAlign="center">
              <input
                type="color"
                value={form.displayOptions.backgroundColor}
                onChange={(e) => setDisplay("backgroundColor", e.target.value)}
                style={{
                  width: "48px",
                  height: "48px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: "2px",
                }}
              />
              <Text variant="bodyMd" as="p" tone="subdued">
                {form.displayOptions.backgroundColor}
              </Text>
            </InlineStack>
          </BlockStack>

          <InlineStack gap="3" align="start" blockAlign="start">
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select
                label="Timer size"
                options={sizeOptions}
                value={form.displayOptions.fontSize}
                onChange={(v) => setDisplay("fontSize", v)}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select
                label="Timer position"
                options={positionOptions}
                value={form.displayOptions.position}
                onChange={(v) => setDisplay("position", v)}
              />
            </div>
          </InlineStack>

          <Select
            label="Urgency notification"
            options={urgencyOptions}
            value={form.urgencySettings.type}
            onChange={(v) => setUrgency("type", v)}
          />
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
