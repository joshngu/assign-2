import { COLORS, FONT_MONO } from "./QueueSmartAuth";
import { StatusBadge } from "./UserBadges";
import { SERVICES, NOTIFICATIONS } from "./userData";

/* ---------------------------------------------------------
   User Dashboard — overview, active services, notifications
--------------------------------------------------------- */
export default function UserDashboardScreen({ user, goJoin, goStatus }) {
  const name = user?.email ? user.email.split("@")[0] : "there";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: FONT_MONO, color: COLORS.slate }}>
          Customer
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
          Welcome back, {name}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: COLORS.ink }}>
            Current appointment
          </h2>
          <p className="text-sm" style={{ color: COLORS.slate }}>
            You're booked for <strong>General Checkup</strong> at <strong>10:30 AM</strong>.
          </p>
          <button
            onClick={goStatus}
            className="qs-btn mt-4 text-xs font-semibold px-3 py-2 rounded-lg"
            style={{ background: COLORS.ink, color: COLORS.paper }}
          >
            View appointment status
          </button>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
            Active services
          </h2>
          <ul className="space-y-2">
            {SERVICES.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span style={{ color: COLORS.ink }}>{s.name}</span>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
          <button
            onClick={goJoin}
            className="qs-btn mt-4 text-xs font-semibold px-3 py-2 rounded-lg"
            style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
          >
            Join a queue
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>
          Notifications
        </h2>
        <ul className="space-y-3">
          {NOTIFICATIONS.map((n) => (
            <li key={n.id} className="flex items-start gap-3 text-sm">
              <span
                className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: n.unread ? COLORS.coral : COLORS.line }}
              />
              <div>
                <p style={{ color: COLORS.ink }}>{n.message}</p>
                <p className="text-xs mt-0.5" style={{ color: COLORS.slate }}>
                  {n.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
