import { z } from "zod";

export const timerSchema = z
  .object({
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
  })
  .refine(
    (data) => {
      const start = new Date(`${data.startDate}T${data.startTime || "00:00"}`);
      const end = new Date(`${data.endDate}T${data.endTime || "00:00"}`);

      return end > start;
    },
    {
      message: "End must be after start",
      path: ["endDate"],
    },
  );
