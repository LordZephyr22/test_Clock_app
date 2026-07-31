import { useState, useEffect, useCallback } from "react";

export interface ClockData {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  hours12: number;
  isAM: boolean;
  day: string;
  date: string;
  month: string;
  year: number;
  hourAngle: number;
  minuteAngle: number;
  secondAngle: number;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function useClock(): ClockData {
  const [now, setNow] = useState(() => new Date());

  const update = useCallback(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, [update]);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  const hours12 = hours % 12 || 12;
  const isAM = hours < 12;

  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
  const minuteAngle = (minutes * 6) + (seconds * 0.1);
  const secondAngle = seconds * 6 + milliseconds * 0.006;

  return {
    hours,
    minutes,
    seconds,
    milliseconds,
    hours12,
    isAM,
    day: DAYS[now.getDay()],
    date: String(now.getDate()).padStart(2, "0"),
    month: MONTHS[now.getMonth()],
    year: now.getFullYear(),
    hourAngle,
    minuteAngle,
    secondAngle,
  };
}
