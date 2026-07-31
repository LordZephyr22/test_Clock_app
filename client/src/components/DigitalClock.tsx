import { useClock } from "@/hooks/useClock";

/**
 * DigitalClock — Midnight Observatory theme
 * Large monospaced time display with cyan glow effect.
 * Shows 12-hour format with AM/PM indicator.
 */
export default function DigitalClock() {
  const { hours12, minutes, seconds, isAM, day, date, month, year } = useClock();

  const timeStr = `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const ampm = isAM ? "AM" : "PM";

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Date display */}
      <div className="font-body text-sm text-muted-foreground tracking-widest uppercase mb-4">
        {day}, {month} {date}, {year}
      </div>

      {/* Digital time */}
      <div className="flex items-baseline gap-3">
        <span className="font-digital text-7xl sm:text-8xl md:text-9xl font-light text-foreground text-glow tabular-nums">
          {timeStr}
        </span>
        <span className="font-digital text-xl sm:text-2xl text-primary/80 font-medium">
          {ampm}
        </span>
      </div>
    </div>
  );
}
