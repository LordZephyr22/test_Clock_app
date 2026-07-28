# Product Requirements Document (PRD)

## Project Overview
**Project Name:** Horizon Clock & Alarm  
**Description:** A sleek, lightweight, full-stack web application that provides real-time clock displays, customizable alarms with audio playback, and world clock capabilities.  
**Primary Goal:** Create an intuitive, high-performance web-based timing utility with clean UI and resilient local browser state persistence.

---

## Architecture & Tech Stack
* **Frontend:** React (Vite) + Tailwind CSS
* **Icons:** Lucide React (`lucide-react`)
* **Audio:** HTML5 Audio API (using local fallback alarms / synthesized audio alerts)
* **Persistence:** Browser `localStorage` for alarm state and user preferences
* **Deployment target:** Vercel / Netlify / Static preview host

---

## Directory Structure
```text
horizon-clock/
├── public/
│   └── alarm-tone.mp3
├── src/
│   ├── components/
│   │   ├── DigitalClock.jsx
│   │   ├── AnalogClock.jsx
│   │   ├── AlarmList.jsx
│   │   └── AddAlarmModal.jsx
│   ├── context/
│   │   └── AlarmContext.jsx
│   ├── hooks/
│   │   └── useClock.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── tailwind.config.js
