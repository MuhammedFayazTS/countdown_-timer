import { useState, useEffect } from "preact/hooks";
import { Countdown } from "./Countdown";

export function TimerCard({ timer }) {
  const { title, description, endDate, urgencySettings, displayOptions } = timer || {};

  const {
    backgroundColor = "#FF0000",
    textColor = "#FFFFFF",
    fontSize = "16px",
    position = "inline",
  } = displayOptions || {};

  const {
    enabled: urgencyEnabled = true,
    triggerMinutes = 5,
    type: urgencyType = "notification_banner",
    message: urgencyMessage = "Hurry! Offer expires soon!",
  } = urgencySettings || {};

  const [isUrgent, setIsUrgent] = useState(() => {
    const diff = new Date(endDate).getTime() - Date.now();
    return urgencyEnabled && diff > 0 && diff <= triggerMinutes * 60 * 1000;
  });

  useEffect(() => {
    if (!urgencyEnabled) return;
    const update = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      setIsUrgent(diff > 0 && diff <= triggerMinutes * 60 * 1000);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate, urgencyEnabled, triggerMinutes]);

  const showBanner = isUrgent && urgencyType === "notification_banner";
  const showPulse = isUrgent && urgencyType === "color_pulse";

  return (
    <div
      class={`ct-card ct-position-${position} ${showPulse ? "ct-pulse" : ""}`}
      style={{ backgroundColor, color: textColor, fontSize }}
    >
      {showBanner && (
        <div class="ct-urgency-banner">
          {urgencyMessage}
        </div>
      )}

      {title && <h3 class="ct-title">{title}</h3>}
      {description && <p class="ct-desc">{description}</p>}

      <Countdown
        endDate={endDate}
        urgencySettings={{
          enabled: urgencyEnabled,
          triggerMinutes,
          type: urgencyType,
          message: urgencyMessage,
        }}
      />
    </div>
  );
}
