import mongoose from "mongoose";

const timerSchema = new mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOptions: {
      backgroundColor: { type: String, default: "#FF0000" },
      textColor: { type: String, default: "#FFFFFF" },
      fontSize: { type: String, default: "16px" },
      position: {
        type: String,
        enum: ["top", "bottom", "inline"],
        default: "inline",
      },
    },
    urgencySettings: {
      enabled: { type: Boolean, default: true },
      triggerMinutes: { type: Number, default: 5 },
      type: {
        type: String,
        enum: ["color_pulse", "notification_banner"],
        default: "notification_banner",
      },
      message: {
        type: String,
        default: "Hurry! Offer expires soon!",
      },
    },
  },
  { timestamps: true },
);

const Timer = mongoose.model("Timer", timerSchema);
export default Timer;
