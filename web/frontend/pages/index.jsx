import { useState } from "react";
import { Page, Layout, Text, Card } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { TimerRowItem, TimerModal, SearchInput } from "../components";

export default function HomePage() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  // TODO: update with react query code
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const timer = {
    _id: 1,
    title: "Timer 1",
    description: "Example countdown timer",
    startDate: "2026-01-01",
    endDate: "2026-01-01",
    isActive: true,
  };

  const handleCreate = () => setModalOpen(true);

  const handleModalClose = () => setModalOpen(false);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      // TODO: API call to save timer
      console.log("Save timer:", data);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page
      title="Countdown Timer Manager"
      subtitle="Create and manage countdown timers for your promotions"
      primaryAction={{
        content: "+ Create timer",
        onAction: handleCreate,
      }}
    >
      <TimerModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        loading={saving}
        editTimer={null}
      />
      <TitleBar title={t("HomePage.title")} />

      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              {t("HomePage.heading")}
            </Text>

            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search timers"
            />
            <TimerRowItem timer={timer} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
