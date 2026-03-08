import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { TimerCard } from "./components/TimerCard";
import "./timer-widget.css";

async function fetchTimers(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch timers");
    return await res.json();
  } catch (err) {
    console.error("Timer fetch error:", err);
    return null;
  }
}

function TimerApp() {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await fetchTimers("/apps/timer-widget/active");

      if (!data) return;

      if (Array.isArray(data.timers)) {
        setTimers(data.timers);
      } else if (data.timer) {
        setTimers([data.timer]);
      }
    }

    load();
  }, []);

  if (!timers.length) return null;

  return (
    <div class="ct-widget">
      {timers.map((timer) => (
        <TimerCard key={timer._id} timer={timer} />
      ))}
    </div>
  );
}

const root = document.getElementById("timer-widget-root");

if (root) {
  render(<TimerApp />, root);
}