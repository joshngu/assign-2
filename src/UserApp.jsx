import { useState } from "react";
import { Ticket, LogOut, LayoutDashboard, ListPlus, Clock, History as HistoryIcon } from "lucide-react";

import { COLORS } from "./QueueSmartAuth";
import { SERVICES } from "./userData";
import { NotificationBell} from "./Notifications";
import UserDashboardScreen from "./UserDashboardScreen";
import JoinQueueScreen from "./JoinQueueScreen";
import QueueStatusScreen from "./QueueStatusScreen";
import HistoryScreen from "./HistoryScreen";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "join", label: "Join Queue", icon: ListPlus },
  { id: "status", label: "Queue Status", icon: Clock },
  { id: "history", label: "History", icon: HistoryIcon },
];

/* ---------------------------------------------------------
   User shell — header, tab navigation, and screen routing.
   The 4 screens each live in their own file and are wired
   in here.
--------------------------------------------------------- */
export default function UserApp({ user, onLogout }) {
  const [screen, setScreen] = useState("dashboard");
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES[0].id);

  function goTo(id) {
    setScreen(id);
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.paper }}>
      <header
        className="flex items-center justify-between px-6 md:px-12 py-5 border-b"
        style={{ borderColor: COLORS.line }}
      >
        <div className="flex items-center gap-2">
          <Ticket size={20} style={{ color: COLORS.ink }} />
          <span className="font-semibold" style={{ color: COLORS.ink }}>
            QueueSmart
          </span>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <span className="text-xs hidden sm:inline" style={{ color: COLORS.slate }}>
            {user?.email}
          </span>
          <button
            onClick={onLogout}
            className="qs-btn flex items-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg"
            style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ink }}
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      <nav className="flex gap-1 px-6 md:px-12 pt-4 border-b overflow-x-auto" style={{ borderColor: COLORS.line }}>
        {TABS.map((tab) => (
          <TabButton key={tab.id} tab={tab} active={screen === tab.id} onClick={() => goTo(tab.id)} />
        ))}
      </nav>

      <main className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
        {screen === "dashboard" && (
          <UserDashboardScreen user={user} goJoin={() => goTo("join")} goStatus={() => goTo("status")} />
        )}
        {screen === "join" && (
          <JoinQueueScreen selectedServiceId={selectedServiceId} setSelectedServiceId={setSelectedServiceId} />
        )}
        {screen === "status" && <QueueStatusScreen />}
        {screen === "history" && <HistoryScreen />}
      </main>
    </div>
  );
}

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="qs-btn flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px whitespace-nowrap"
      style={{
        borderColor: active ? COLORS.ink : "transparent",
        color: active ? COLORS.ink : COLORS.slate,
      }}
    >
      <Icon size={14} /> {tab.label}
    </button>
  );
}
