import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Clock, Bell } from "lucide-react";
import { useAlarms } from "@/contexts/AlarmContext";

const DAYS_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface AddAlarmModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * AddAlarmModal — Midnight Observatory theme
 * Modal dialog for creating new alarms with time picker, label, and repeat options.
 */
export default function AddAlarmModal({ open, onClose }: AddAlarmModalProps) {
  const { addAlarm } = useAlarms();
  const [hours, setHours] = useState(7);
  const [minutes, setMinutes] = useState(0);
  const [label, setLabel] = useState("Alarm");
  const [repeat, setRepeat] = useState(false);
  const [days, setDays] = useState<boolean[]>([false, true, true, true, true, true, false]);

  if (!open) return null;

  const handleSubmit = () => {
    addAlarm({
      hours,
      minutes,
      label: label || "Alarm",
      enabled: true,
      repeat,
      days: repeat ? days : [false, false, false, false, false, false, false],
    });
    // Reset form
    setHours(7);
    setMinutes(0);
    setLabel("Alarm");
    setRepeat(false);
    setDays([false, true, true, true, true, true, false]);
    onClose();
  };

  const toggleDay = (index: number) => {
    setDays((prev) => prev.map((d, i) => (i === index ? !d : d)));
  };

  const incrementHours = () => setHours((h) => (h + 1) % 24);
  const decrementHours = () => setHours((h) => (h - 1 + 24) % 24);
  const incrementMinutes = () => setMinutes((m) => (m + 1) % 60);
  const decrementMinutes = () => setMinutes((m) => (m - 1 + 60) % 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl"
        style={{
          animation: "fadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1) forwards",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              New Alarm
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Time Picker */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {/* Hours */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={incrementHours}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <span className="text-muted-foreground text-xs">▲</span>
            </button>
            <div
              className="w-20 h-24 flex items-center justify-center bg-secondary/50 rounded-lg border border-border cursor-pointer"
              onClick={() => {
                const input = prompt("Set hours (0-23):", String(hours));
                if (input && !isNaN(Number(input))) {
                  setHours(Math.max(0, Math.min(23, Number(input))));
                }
              }}
            >
              <span className="font-digital text-4xl text-foreground">
                {String(hours).padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={decrementHours}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <span className="text-muted-foreground text-xs">▼</span>
            </button>
            <span className="text-xs text-muted-foreground mt-1">Hour</span>
          </div>

          <span className="font-digital text-4xl text-primary mt-[-24px]">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={incrementMinutes}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <span className="text-muted-foreground text-xs">▲</span>
            </button>
            <div
              className="w-20 h-24 flex items-center justify-center bg-secondary/50 rounded-lg border border-border cursor-pointer"
              onClick={() => {
                const input = prompt("Set minutes (0-59):", String(minutes));
                if (input && !isNaN(Number(input))) {
                  setMinutes(Math.max(0, Math.min(59, Number(input))));
                }
              }}
            >
              <span className="font-digital text-4xl text-foreground">
                {String(minutes).padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={decrementMinutes}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
            >
              <span className="text-muted-foreground text-xs">▼</span>
            </button>
            <span className="text-xs text-muted-foreground mt-1">Minute</span>
          </div>
        </div>

        {/* Label */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Wake up"
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground font-body text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Repeat */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-foreground">Repeat</span>
          <Switch checked={repeat} onCheckedChange={setRepeat} />
        </div>

        {/* Day selector (only when repeat is on) */}
        {repeat && (
          <div className="flex gap-1.5 mb-6">
            {DAYS_LABELS.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleDay(i)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  days[i]
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary/30 text-muted-foreground border border-border hover:border-primary/20"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {!repeat && <div className="mb-6" />}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 font-body"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 font-body"
          >
            <Clock className="w-4 h-4 mr-1.5" />
            Save Alarm
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
