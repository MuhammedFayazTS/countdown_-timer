import { z } from "zod";

const baseSchema = z.object({
  title: z.string().min(1, "Timer name is required"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().optional(),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().optional(),
  description: z.string().optional(),

  displayOptions: z.object({
    backgroundColor: z.string(),
    fontSize: z.string(),
    position: z.string(),
  }),

  urgencySettings: z.object({
    type: z.string(),
  }),
});

export const timerSchema = baseSchema.strip().refine(
  (data) => {
    const startDay = data.startDate.split("T")[0];
    const endDay = data.endDate.split("T")[0];

    const start = new Date(`${startDay}T${data.startTime || "00:00"}`);
    const end = new Date(`${endDay}T${data.endTime || "00:00"}`);

    return end > start;
  },
  {
    message: "End must be after start",
    path: ["endDate"],
  },
);

export const timerUpdateSchema = baseSchema
  .partial()
  .strip()
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const startDay = data.startDate.split("T")[0];
        const endDay = data.endDate.split("T")[0];

        const start = new Date(`${startDay}T${data.startTime || "00:00"}`);
        const end = new Date(`${endDay}T${data.endTime || "00:00"}`);
        return end > start;
      }
      return true;
    },
    {
      message: "End must be after start",
      path: ["endDate"],
    },
  );
