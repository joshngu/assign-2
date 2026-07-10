import { COLORS, FONT_MONO } from "./QueueSmartAuth";
import { OutcomeBadge } from "./UserBadges";
import { HISTORY } from "./userData";

/* ---------------------------------------------------------
   History — past queues joined
--------------------------------------------------------- */
export default function HistoryScreen() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: FONT_MONO, color: COLORS.slate }}>
          History
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>
          Past queues
        </h1>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.line}` }}>
              <th className="text-left font-medium px-5 py-3" style={{ color: COLORS.slate }}>
                Date
              </th>
              <th className="text-left font-medium px-5 py-3" style={{ color: COLORS.slate }}>
                Time
              </th>
              <th className="text-left font-medium px-5 py-3" style={{ color: COLORS.slate }}>
                Service
              </th>
              <th className="text-left font-medium px-5 py-3" style={{ color: COLORS.slate }}>
                Outcome
              </th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h) => (
              <tr key={h.id} style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                <td className="px-5 py-3" style={{ color: COLORS.ink }}>
                  {h.date}
                </td>
                <td className="px-5 py-3" style={{ color: COLORS.ink }}>
                  {h.time}
                </td>
                <td className="px-5 py-3" style={{ color: COLORS.ink }}>
                  {h.service}
                </td>
                <td className="px-5 py-3">
                  <OutcomeBadge outcome={h.outcome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
