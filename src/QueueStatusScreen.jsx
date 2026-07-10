import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

import { COLORS, FONT_MONO } from "./QueueSmartAuth";

const STATUS_STEPS = [
  { id: "waiting", label: "Waiting" },
  { id: "almost", label: "Almost ready" },
  { id: "served", label: "Served" },
];

const MOCK_APPOINTMENT = {
  service: "General Checkup",
  time: "10:30 AM",
  startMinutesUntil: 21,
};

/* ---------------------------------------------------------
   Queue Status — booked appointment, time until it starts,
   and a status stepper
--------------------------------------------------------- */
export default function QueueStatusScreen() {
  const [minutesUntil, setMinutesUntil] = useState(MOCK_APPOINTMENT.startMinutesUntil);
  const currentStep = minutesUntil === 0 ? "served" : minutesUntil <= 9 ? "almost" : "waiting";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: FONT_MONO, color: COLORS.slate }}>
          Queue status
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
          Your appointment
        </h1>
      </div>

      <div className="rounded-2xl p-6" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: COLORS.slate }}>
              {MOCK_APPOINTMENT.service}
            </p>
            <p className="text-4xl font-semibold mt-1" style={{ fontFamily: FONT_MONO, color: COLORS.ink }}>
              {MOCK_APPOINTMENT.time}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: COLORS.slate }}>
              Time until appointment
            </p>
            <p className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
              {minutesUntil} min
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full" style={{ background: COLORS.line }}>
          <div
            className="h-2 rounded-full"
            style={{
              width: `${Math.max(6, (1 - minutesUntil / MOCK_APPOINTMENT.startMinutesUntil) * 100)}%`,
              background: COLORS.amber,
            }}
          />
        </div>
        <p className="mt-2 text-xs" style={{ color: COLORS.slate }}>
          {minutesUntil === 0
            ? "It's your turn — please check in at the desk."
            : `Estimated wait: ~${minutesUntil} min`}
        </p>

        <StatusStepper current={currentStep} />

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setMinutesUntil((m) => Math.max(0, m - 3))}
            className="qs-btn text-xs font-medium px-3 py-2 rounded-lg"
            style={{ background: COLORS.ink, color: COLORS.paper }}
          >
            (Demo) simulate time passing
          </button>
          <button
            type="button"
            className="qs-btn text-xs font-medium px-3 py-2 rounded-lg"
            style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
          >
            Cancel appointment
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusStepper({ current }) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center mt-6">
      {STATUS_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              {done ? (
                <CheckCircle2 size={20} style={{ color: COLORS.green }} />
              ) : (
                <Circle
                  size={20}
                  style={{ color: active ? COLORS.ink : COLORS.line }}
                  fill={active ? COLORS.ink : "none"}
                />
              )}
              <p
                className="text-xs mt-1.5 whitespace-nowrap"
                style={{ color: active || done ? COLORS.ink : COLORS.slate, fontWeight: active ? 600 : 400 }}
              >
                {step.label}
              </p>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mb-5"
                style={{ background: i < currentIndex ? COLORS.green : COLORS.line }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
