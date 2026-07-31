import { Bell, Moon } from "lucide-react";
import { useAlarms } from "@/contexts/AlarmContext";

/**
 * ActiveAlarmOverlay — Full-screen overlay when an alarm triggers.
 * Provides clear snooze and dismiss actions with visual feedback.
 */
export default function ActiveAlarmOverlay() {
  const { activeAlarm, snoozeAlarm, dismissAlarm } = useAlarms();

  if (!activeAlarm) return null;

  const formatTime = (hours: number, minutes: number): string => {
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    return `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Overlay card */}
      <div className="relative text-center max-w-sm w-full">
        {/* Pulsing bell icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30">
            <Bell className="w-12 h-12 text-primary animate-bounce" />
          </div>
        </div>

        {/* Alarm info */}
        <div className="mb-8">
          <p className="font-body text-sm text-muted-foreground uppercase tracking-widest mb-2">
            Alarm
          </p>
          <p className="font-digital text-5xl text-foreground text-glow mb-2">
            {formatTime(activeAlarm.hours, activeAlarm.minutes)}
          </p>
          <p className="font-body text-lg text-foreground/80">
            {activeAlarm.label}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => snoozeAlarm(activeAlarm.id)}
            className="w-full py-3.5 rounded-xl bg-primary/20 border border-primary/30 text-primary font-body font-medium text-base hover:bg-primary/30 transition-all active:scale-[0.97]"
          >
            Snooze 5 Minutes
          </button>
          <button
            onClick={() => dismissAlarm(activeAlarm.id)}
            className="w-full py-3.5 rounded-xl bg-card border border-border text-foreground font-body font-medium text-base hover:bg-accent transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
            <Moon className="w-4 h-4" />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
