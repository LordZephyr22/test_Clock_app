import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";

export interface Alarm {
  id: string;
  hours: number;
  minutes: number;
  label: string;
  enabled: boolean;
  repeat: boolean;
  days: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  snoozedUntil: number | null;
}

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, "id" | "snoozedUntil">) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  snoozeAlarm: (id: string, minutes?: number) => void;
  dismissAlarm: (id: string) => void;
  activeAlarm: Alarm | null;
}

const ALARM_STORAGE_KEY = "horizon-clock-alarms";
const SNOOZE_DURATION = 5; // minutes

const AlarmContext = createContext<AlarmContextType | null>(null);

function loadAlarms(): Alarm[] {
  try {
    const stored = localStorage.getItem(ALARM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((a: Alarm) => ({ ...a, snoozedUntil: a.snoozedUntil ?? null }));
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveAlarms(alarms: Alarm[]) {
  localStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(alarms));
}

export function AlarmProvider({ children }: { children: ReactNode }) {
  const [alarms, setAlarms] = useState<Alarm[]>(loadAlarms);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persist alarms on change
  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  const addAlarm = useCallback((alarm: Omit<Alarm, "id" | "snoozedUntil">) => {
    const newAlarm: Alarm = {
      ...alarm,
      id: crypto.randomUUID(),
      snoozedUntil: null,
    };
    setAlarms((prev) => [...prev, newAlarm]);
  }, []);

  const removeAlarm = useCallback((id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled, snoozedUntil: null } : a))
    );
  }, []);

  const snoozeAlarm = useCallback((id: string, minutes = SNOOZE_DURATION) => {
    const until = Date.now() + minutes * 60 * 1000;
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, snoozedUntil: until } : a))
    );
    setActiveAlarm(null);
  }, []);

  const dismissAlarm = useCallback((id: string) => {
    setAlarms((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        if (a.repeat) {
          return { ...a, snoozedUntil: null };
        }
        return { ...a, enabled: false, snoozedUntil: null };
      })
    );
    setActiveAlarm(null);
  }, []);

  // Check alarms every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeAlarm) return; // don't trigger new alarms while one is active

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentDay = now.getDay(); // 0=Sun, 1=Mon, ...

      for (const alarm of alarms) {
        if (!alarm.enabled) continue;

        // Check if snoozed
        if (alarm.snoozedUntil && Date.now() < alarm.snoozedUntil) continue;

        if (alarm.hours === currentHours && alarm.minutes === currentMinutes) {
          // Check day repeat
          if (alarm.repeat && !alarm.days[currentDay]) continue;

          setActiveAlarm(alarm);
          // Clear snooze
          setAlarms((prev) =>
            prev.map((a) => (a.id === alarm.id ? { ...a, snoozedUntil: null } : a))
          );
          break;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, activeAlarm]);

  // Play alarm sound when active
  useEffect(() => {
    if (activeAlarm) {
      // Create audio oscillator as fallback alarm tone
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const playBeep = () => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          osc.type = "sine";
          gain.gain.value = 0.3;
          osc.start();
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.stop(ctx.currentTime + 0.5);
        };
        // Play beep every second
        playBeep();
        const beepInterval = setInterval(playBeep, 1000);
        return () => {
          clearInterval(beepInterval);
          ctx.close();
        };
      } catch {
        // Audio not available
      }
    }
  }, [activeAlarm]);

  return (
    <AlarmContext.Provider
      value={{ alarms, addAlarm, removeAlarm, toggleAlarm, snoozeAlarm, dismissAlarm, activeAlarm }}
    >
      {children}
    </AlarmContext.Provider>
  );
}

export function useAlarms() {
  const ctx = useContext(AlarmContext);
  if (!ctx) throw new Error("useAlarms must be used within AlarmProvider");
  return ctx;
}
