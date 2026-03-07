export const fetchTimers = async (search = "") => {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }

  const response = await fetch(
    `/api/timers${params.toString() ? `?${params.toString()}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch timers");
  }

  return await response.json();
};

export const createTimer = async (formData) => {
  return await fetch("/api/timers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};
