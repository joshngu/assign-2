import { useState } from "react";
import { Clock, CheckCircle2, CircleAlert, CalendarDays } from "lucide-react";

import { COLORS, FONT_MONO } from "./QueueSmartAuth";
import { StatusBadge } from "./UserBadges";
import { SERVICES } from "./userData";
import { useNotifications } from "./Notifications";

function today() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------------------------------------------------------
   Join Queue — select a service, pick a preferred date and
   an available appointment timestamp, and book or cancel it
--------------------------------------------------------- */
export default function JoinQueueScreen({ selectedServiceId, setSelectedServiceId }) {
  const { notify } = useNotifications();
  const [bookedTime, setBookedTime] = useState(null);
  const [preferredDate, setPreferredDate] = useState(today());
  const [dateError, setDateError] = useState("");
  const service = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const nextAvailable = service.timeSlots.find((slot) => slot.available);

  function selectService(id) {
    setSelectedServiceId(id);
    setBookedTime(null);
  }

  function handleDateChange(event) {
    setPreferredDate(event.target.value);
    setDateError("");
  }

  function validateDate(value) {
    if (!value) return "Preferred date is required.";
    if (value < today()) return "Preferred date can't be in the past.";
    return "";
  }

  function bookSlot(time) {
    const error = validateDate(preferredDate);
    if (error) {
      setDateError(error);
      return;
    }
    setBookedTime(time);
    notify({
      title: `${service.name} appointment confirmed`,
      body: `You're booked for ${preferredDate} at ${time}.`,
    });
  }

  function cancelBooking() {
    notify({ 
      title: `${service.name} appointment cancelled`,
      body: `Your ${bookedTime} slot has been released.`,
    });
    setBookedTime(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: FONT_MONO, color: COLORS.slate }}>
          Join a queue
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
          Book an appointment
        </h1>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectService(s.id)}
            className="qs-btn text-left rounded-2xl p-4"
            style={{
              background: "#fff",
              border: `1px solid ${s.id === selectedServiceId ? COLORS.ink : COLORS.line}`,
              boxShadow: s.id === selectedServiceId ? `0 0 0 1px ${COLORS.ink}` : "none",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
              {s.name}
            </p>
            <p className="text-xs mt-1" style={{ color: COLORS.slate }}>
              {s.description}
            </p>
            <div className="mt-3">
              <StatusBadge status={s.status} />
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-6" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
        <h2 className="text-lg font-semibold" style={{ color: COLORS.ink }}>
          {service.name}
        </h2>
        <p className="text-sm mt-1" style={{ color: COLORS.slate }}>
          {service.description}
        </p>

        <div className="mt-5">
          <p className="text-xs" style={{ color: COLORS.slate }}>
            Appointment length
          </p>
          <p className="text-lg font-semibold flex items-center gap-1.5" style={{ color: COLORS.ink }}>
            <Clock size={16} /> {service.durationMinutes} min
          </p>
        </div>

        {service.status === "closed" ? (
          <p className="mt-5 text-sm flex items-center gap-1.5" style={{ color: COLORS.coral }}>
            <CircleAlert size={16} /> This service isn't taking appointments right now.
          </p>
        ) : (
          <>
            <div className="mt-6">
              <label htmlFor="preferred-date" className="text-xs font-medium flex items-center gap-1.5 mb-2" style={{ color: COLORS.slate }}>
                <CalendarDays size={14} /> Preferred date
              </label>
              <input
                id="preferred-date"
                type="date"
                min={today()}
                value={preferredDate}
                onChange={handleDateChange}
                aria-invalid={!!dateError}
                aria-describedby={dateError ? "preferred-date-error" : undefined}
                className="qs-input text-sm px-3 py-2 rounded-lg"
                style={{ border: `1px solid ${dateError ? COLORS.coral : COLORS.line}`, background: "#fff", color: COLORS.ink }}
              />
              {dateError && (
                <p id="preferred-date-error" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: COLORS.coral }}>
                  <CircleAlert size={12} /> {dateError}
                </p>
              )}
            </div>

            <p className="text-xs font-medium mt-6 mb-2" style={{ color: COLORS.slate }}>
              Available timestamps
            </p>
            <div className="flex flex-wrap gap-2">
              {service.timeSlots.map((slot) => {
                const isBooked = bookedTime === slot.time;
                const isNextAvailable = nextAvailable?.time === slot.time && !bookedTime;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available && !isBooked}
                    onClick={() => bookSlot(slot.time)}
                    className="qs-btn text-sm font-medium px-3 py-2 rounded-lg"
                    style={{
                      background: isBooked ? COLORS.ink : "#fff",
                      color: isBooked ? COLORS.paper : slot.available ? COLORS.ink : COLORS.slate,
                      border: `1px solid ${isBooked ? COLORS.ink : slot.available ? COLORS.line : COLORS.line}`,
                      opacity: slot.available || isBooked ? 1 : 0.45,
                      textDecoration: !slot.available && !isBooked ? "line-through" : "none",
                    }}
                  >
                    {slot.time}
                    {isNextAvailable ? " · Next" : ""}
                  </button>
                );
              })}
            </div>

            {bookedTime ? (
              <div className="mt-5">
                <p className="text-sm flex items-center gap-1.5" style={{ color: COLORS.greenText }}>
                  <CheckCircle2 size={16} /> You're booked for {service.name} on {preferredDate} at {bookedTime}.
                </p>
                <button
                  type="button"
                  onClick={cancelBooking}
                  className="qs-btn mt-3 text-sm font-semibold px-4 py-2.5 rounded-lg"
                  style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
                >
                  Cancel appointment
                </button>
              </div>
            ) : (
              <p className="mt-5 text-xs" style={{ color: COLORS.slate }}>
                Select an available timestamp above to book your appointment.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
