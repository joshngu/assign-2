import { COLORS } from "./QueueSmartAuth";

export function StatusBadge({ status }) {
  const open = status === "open";
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        background: open ? "#E7F5EA" : "#FBEAE7",
        color: open ? COLORS.greenText : COLORS.coral,
      }}
    >
      {open ? "Open" : "Closed"}
    </span>
  );
}

export function OutcomeBadge({ outcome }) {
  const styles = {
    Served: { background: "#E7F5EA", color: COLORS.greenText },
    "Left queue": { background: "#F1F1EE", color: COLORS.slate },
    "No-show": { background: "#FBEAE7", color: COLORS.coral },
  };
  const style = styles[outcome] || styles["Left queue"];
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={style}>
      {outcome}
    </span>
  );
}
