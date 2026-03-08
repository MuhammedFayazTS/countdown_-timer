export const getTimerStatus = (timer) => {
  const now = new Date();
  const start = timer.startDate ? new Date(timer.startDate) : null;
  const end = timer.endDate ? new Date(timer.endDate) : null;

  if (!start || !end) return { label: "Inactive", tone: "critical" };

  if (now < start) {
    return { label: "Scheduled", tone: "attention" };
  }

  if (now >= start && now <= end) {
    return { label: "Active", tone: "success" };
  }

  return { label: "Expired", tone: "critical" };
};
