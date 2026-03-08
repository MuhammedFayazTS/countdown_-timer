import { useState, useEffect } from "preact/hooks";
import { formatTime, padZero } from "../utils/helpers";
import { Separator } from "./Separator";

export function Countdown({ endDate, urgencySettings }) {
  const [time, setTime] = useState(() =>
    formatTime(new Date(endDate).getTime() - Date.now()),
  );

  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(endDate).getTime() - Date.now(); //in ms
      const next = formatTime(diff);

      setTime(next);

      if (
        urgencySettings?.enabled &&
        diff > 0 &&
        diff <= (urgencySettings.triggerMinutes || 5) * 60 * 1000
      ) {
        setUrgent(true);
      } else {
        setUrgent(false);
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (time.expired) {
    return <div class="ct-expired">Offer expired</div>;
  }

  return (
    <div class={`ct-countdown ${urgent ? "ct-urgent" : ""}`}>
      <TimeUnit value={time.days} label="Days" />
      <Separator />
      <TimeUnit value={time.hours} label="Hours" />
      <Separator />
      <TimeUnit value={time.minutes} label="Mins" />
      <Separator />
      <TimeUnit value={time.seconds} label="Secs" />
    </div>
  );
}

function TimeUnit({ value, label }) {
  return (
    <div class="ct-unit">
      <span class="ct-value">{padZero(value)}</span>
      <span class="ct-label">{label}</span>
    </div>
  );
}
