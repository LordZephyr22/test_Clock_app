/**
 * Home — Midnight Observatory theme
 * Main page composing DigitalClock, AnalogClock, and AlarmList.
 * Layout: centered clock display with alarm panel on the right (desktop) / below (mobile).
 */
import { useState } from "react";
import DigitalClock from "@/components/DigitalClock";
import AnalogClock from "@/components/AnalogClock";
import AlarmList from "@/components/AlarmList";
import AddAlarmModal from "@/components/AddAlarmModal";
import ActiveAlarmOverlay from "@/components/ActiveAlarmOverlay";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [clockMode, setClockMode] = useState<"digital" | "analog">("digital");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-oklch(0.08 0.03 260)" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border-2 border-primary" />
            </div>
            <h1 className="font-display text-lg font-semibold text-foreground">
              Horizon
            </h1>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-body font-medium hover:bg-primary/20 transition-all"
          >
            + Alarm
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 px-6 py-4">
          {/* Clock section */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-lg">
              <Tabs
                value={clockMode}
                onValueChange={(v) => setClockMode(v as "digital" | "analog")}
              >
                <TabsList className="mb-6 mx-auto bg-secondary/50 border border-border">
                  <TabsTrigger value="digital" className="font-body data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    Digital
                  </TabsTrigger>
                  <TabsTrigger value="analog" className="font-body data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    Analog
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="digital">
                  <DigitalClock />
                </TabsContent>

                <TabsContent value="analog">
                  <AnalogClock />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Alarm panel */}
          <div className="w-full lg:w-80 lg:shrink-0">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
              <AlarmList onAddClick={() => setModalOpen(true)} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 text-center">
          <p className="font-body text-xs text-muted-foreground/50">
            Horizon Clock — Your time, illuminated
          </p>
        </footer>
      </div>

      {/* Modals */}
      <AddAlarmModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <ActiveAlarmOverlay />
    </div>
  );
}
