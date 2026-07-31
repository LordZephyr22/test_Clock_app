import { useClock } from "@/hooks/useClock";
import { useAlarms } from "@/contexts/AlarmContext";

/**
 * AnalogClock — Midnight Observatory theme
 * SVG-based analog clock with glowing hands, tick marks, and alarm indicators.
 */
export default function AnalogClock() {
  const { hourAngle, minuteAngle, secondAngle } = useClock();
  const { alarms } = useAlarms();

  const size = 320;
  const center = size / 2;
  const radius = 140;

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6) * (Math.PI / 180) - Math.PI / 2;
    const isHour = i % 5 === 0;
    const outerR = radius;
    const innerR = isHour ? radius - 14 : radius - 7;
    const x1 = center + innerR * Math.cos(angle);
    const y1 = center + innerR * Math.sin(angle);
    const x2 = center + outerR * Math.cos(angle);
    const y2 = center + outerR * Math.sin(angle);
    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isHour ? "oklch(0.7 0.02 260)" : "oklch(0.4 0.02 260)"}
        strokeWidth={isHour ? 2.5 : 1}
      />
    );
  }

  // Generate hour numbers
  const numbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const numR = radius - 28;
    const x = center + numR * Math.cos(angle);
    const y = center + numR * Math.sin(angle);
    numbers.push(
      <text
        key={i}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-digital text-sm"
        fill="oklch(0.65 0.02 260)"
      >
        {i}
      </text>
    );
  }

  // Alarm indicators
  const alarmMarkers = alarms
    .filter((a) => a.enabled && !a.snoozedUntil)
    .map((alarm, i) => {
      const totalMinutes = alarm.hours * 60 + alarm.minutes;
      const angle = (totalMinutes * 6 - 90) * (Math.PI / 180);
      const markerR = radius + 12;
      const x = center + markerR * Math.cos(angle);
      const y = center + markerR * Math.sin(angle);
      return (
        <circle
          key={`alarm-${i}`}
          cx={x}
          cy={y}
          r={3}
          fill="oklch(0.8 0.18 75)"
        />
      );
    });

  return (
    <div className="flex justify-center py-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="clock-glow"
      >
        {/* Outer ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="none"
          stroke="oklch(0.3 0.03 260)"
          strokeWidth={1}
        />

        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="oklch(0.12 0.02 260)"
          stroke="oklch(0.25 0.02 260)"
          strokeWidth={1}
        />

        {/* Tick marks */}
        {ticks}

        {/* Hour numbers */}
        {numbers}

        {/* Alarm markers */}
        {alarmMarkers}

        {/* Hour hand */}
        <line
          className="clock-hand"
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 0.5}
          stroke="oklch(0.85 0.01 260)"
          strokeWidth={5}
          strokeLinecap="round"
          style={{
            transform: `rotate(${hourAngle}deg)`,
            transformOrigin: `${center}px ${center}px`,
          }}
        />

        {/* Minute hand */}
        <line
          className="clock-hand"
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius * 0.72}
          stroke="oklch(0.85 0.01 260)"
          strokeWidth={3}
          strokeLinecap="round"
          style={{
            transform: `rotate(${minuteAngle}deg)`,
            transformOrigin: `${center}px ${center}px`,
          }}
        />

        {/* Second hand */}
        <line
          className="clock-hand"
          x1={center}
          y1={center + radius * 0.15}
          x2={center}
          y2={center - radius * 0.82}
          stroke="oklch(0.75 0.18 210)"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{
            transform: `rotate(${secondAngle}deg)`,
            transformOrigin: `${center}px ${center}px`,
          }}
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r={5} fill="oklch(0.75 0.18 210)" />
        <circle cx={center} cy={center} r={2.5} fill="oklch(0.12 0.02 260)" />
      </svg>
    </div>
  );
}
