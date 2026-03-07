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

export const fetchTimerById = async (id) => {
  if (!id) {
    throw new Error("Invalid id for timer");
  }

  const response = await fetch(`/api/timers/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch timer");
  }

  return await response.json();
};

export const createTimer = async (formData) => {
  const response = await fetch("/api/timers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create timer");
  }

  return data;
};

export const updateTimer = async ({ id, formData }) => {
  if (!id) throw new Error("Invalid id for timer");

  const response = await fetch(`/api/timers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update timer");
  }

  return data;
};

export const deleteTimer = async (id) => {
  if (!id) throw new Error("Invalid id for timer");

  const response = await fetch(`/api/timers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete timer");
  }

  return data;
};
