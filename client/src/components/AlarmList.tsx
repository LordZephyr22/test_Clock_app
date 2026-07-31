import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Trash2, Plus, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAlarms } from "@/contexts/AlarmContext";
import type { Alarm } from "@/contexts/AlarmContext";

const DAYS_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface AlarmListProps {
  onAddClick: () => void;
}

/**
 * AlarmList — Midnight Observatory theme
 * Displays all alarms with toggle, snooze/dismiss, and delete actions.
 */
export default function AlarmList({ onAddClick }: AlarmListProps) {
  const { alarms, toggleAlarm, removeAlarm, snoozeAlarm, dismissAlarm, activeAlarm } = useAlarms();

  const formatTime = (hours: number, minutes: number): string => {
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? "AM" : "PM";
    return `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  const formatDays = (days: boolean[], repeat: boolean): string => {
    if (!repeat) return "Once";
    const allSelected = days.every(Boolean);
    if (allSelected) return "Every day";
    const weekdaysSelected = days.slice(1, 6).every(Boolean);
    const weekendSelected = days[0] && days[6];
    if (weekdaysSelected && !weekendSelected) return "Weekdays";
    if (weekendSelected && !weekdaysSelected) return "Weekends";
    return days
      .map((d, i) => (d ? DAYS_LABELS[i] : null))
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" />
          Alarms
        </h2>
        <Button
          onClick={onAddClick}
          size="sm"
          className="font-body"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Alarm List */}
      {alarms.length === 0 ? (
        <div className="text-center py-12">
          <BellOff className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No alarms set</p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Tap "Add" to create your first alarm
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              isActive={activeAlarm?.id === alarm.id}
              formatTime={formatTime}
              formatDays={formatDays}
              onToggle={() => toggleAlarm(alarm.id)}
              onDelete={() => removeAlarm(alarm.id)}
              onSnooze={() => snoozeAlarm(alarm.id)}
              onDismiss={() => dismissAlarm(alarm.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface AlarmCardProps {
  alarm: Alarm;
  isActive: boolean;
  formatTime: (h: number, m: number) => string;
  formatDays: (days: boolean[], repeat: boolean) => string;
  onToggle: () => void;
  onDelete: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

function AlarmCard({
  alarm,
  isActive,
  formatTime,
  formatDays,
  onToggle,
  onDelete,
  onSnooze,
  onDismiss,
}: AlarmCardProps) {
  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 ${
        isActive
          ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20"
          : "bg-card border-border hover:border-primary/20"
      }`}
    >
      {/* Active alarm pulse indicator */}
      {isActive && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
      )}

      <div className="p-4">
        {/* Main row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`font-digital text-3xl font-semibold tabular-nums ${
                alarm.enabled ? "text-foreground" : "text-muted-foreground"
              }`}>
                {formatTime(alarm.hours, alarm.minutes)}
              </span>
            </div>
            <p className="font-body text-sm text-muted-foreground mt-0.5">
              {alarm.label}
            </p>
            {alarm.repeat && (
              <p className="font-body text-xs text-primary/60 mt-0.5">
                {formatDays(alarm.days, alarm.repeat)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Snooze / Dismiss when active */}
            {isActive && (
              <div className="flex gap-2 mr-2">
                <button
                  onClick={onSnooze}
                  className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-body font-medium hover:bg-primary/30 transition-colors"
                >
                  Snooze 5m
                </button>
                <button
                  onClick={onDismiss}
                  className="px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-xs font-body font-medium hover:bg-destructive/30 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Toggle */}
            <Switch
              checked={alarm.enabled}
              onCheckedChange={onToggle}
            />

            {/* Delete */}
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors group"
            >
              <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
            </button>
          </div>
        </div>

        {/* Snoozed indicator */}
        {alarm.snoozedUntil && !isActive && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <span className="font-body text-xs text-primary/70">
              Snoozed until{" "}
              {formatTime(
                new Date(alarm.snoozedUntil).getHours(),
                new Date(alarm.snoozedUntil).getMinutes()
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
