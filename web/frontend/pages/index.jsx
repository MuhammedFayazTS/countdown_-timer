import { useState } from "react";
import { Page, Layout, Text, Card } from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { TimerRowItem, TimerModal, SearchInput } from "../components";
import { useFetchTimers } from "../hooks/queries/useTimerQueries";
import { useCreateTimer } from "../hooks/mutations/useTimerMutations";

export default function HomePage() {
  const { t } = useTranslation();
  const shopify = useAppBridge();

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useFetchTimers({
    search,
  });

  const { mutate: createTimer, isPending: saving } = useCreateTimer({
    onSuccess: () => {
      setModalOpen(false);
      shopify.toast.show(t("TimerModal.saveSuccess"));
    },
    onError: () => {
      shopify.toast.show(t("TimerModal.saveError"), { isError: true });
    },
  });

  const timers = data?.timers ?? [];

  const handleCreate = () => setModalOpen(true);

  const handleModalClose = () => setModalOpen(false);

  const handleSave = (formData) => {
    createTimer(formData);
  };

  if (isError) {
    shopify.toast.show(t("HomePage.loadError"), { isError: true });
  }

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
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search timers"
            />

            {isLoading && (
              <Text variant="bodyMd" as="p">
                {t("HomePage.loadingTimers")}
              </Text>
            )}

            {!isLoading && timers.length === 0 && (
              <Text variant="bodyMd" as="p">
                {t("HomePage.noTimers")}
              </Text>
            )}

            {!isLoading &&
              timers.map((timer) => (
                <TimerRowItem key={timer._id} timer={timer} />
              ))}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
