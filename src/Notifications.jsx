import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

import { COLORS } from "./QueueSmartAuth";

const SEED_NOTIFICATIONS = [
  {
    id: "n1",
    title: "General Checkup appointment confirmed",
    body: "You're booked for 10:30 AM.",
    read: false,
    ts: Date.now() - 1000 * 60 * 5,
  },
  {
    id: "n2",
    title: "Vaccination is open again",
    body: "Booking has reopened for this service.",
    read: false,
    ts: Date.now() - 1000 * 60 * 60,
  },
  {
    id: "n3",
    title: "Lab Work — served",
    body: "Your appointment has been completed.",
    read: true,
    ts: Date.now() - 1000 * 60 * 60 * 24,
  },
];

function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

// Context + provider; other screens call useNotifications().notify({ title, body })to push a notification

const NotificationContext = createContext(null);

export function NotificationProvider({ children, seed = SEED_NOTIFICATIONS }) {
  const [items, setItems] = useState(seed);
  const idRef = useRef(seed.length + 1);

  const notify = useCallback(({ title, body }) => {
    const item = {
      id: `n${idRef.current++}`,
      title,
      body,
      read: false,
      ts: Date.now(),
    };
    setItems((prev) => [item, ...prev]);
  }, []);

  const markRead = useCallback((id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ items, unreadCount, notify, markRead, markAllRead, remove }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}

// Bell button + dropdown panel; drop into any header

export function NotificationBell() {
  const { items, unreadCount, markRead, markAllRead, remove } = useNotifications();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="text-sm"
        style={{ color: COLORS.ink }}
      >
        Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-72 max-w-[90vw] z-50"
          style={{ background: "#fff", border: `1px solid ${COLORS.line}` }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: COLORS.line }}>
            <span className="text-xs" style={{ color: COLORS.slate }}>
              Notifications
            </span>
            {items.length > 0 && (
              <button type="button" onClick={markAllRead} className="text-xs underline" style={{ color: COLORS.ink }}>
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-3 py-4 text-xs" style={{ color: COLORS.slate }}>
                No notifications.
              </p>
            ) : (
              items.map((n) => (
                <div key={n.id} className="px-3 py-2 border-b last:border-b-0" style={{ borderColor: COLORS.line }}>
                  <p className="text-sm" style={{ color: COLORS.ink, fontWeight: n.read ? 400 : 600 }}>
                    {n.title}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.slate }}>
                    {n.body}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs" style={{ color: COLORS.slate }}>
                      {timeAgo(n.ts)}
                    </span>
                    <div className="flex gap-2">
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markRead(n.id)}
                          className="text-xs underline"
                          style={{ color: COLORS.ink }}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(n.id)}
                        className="text-xs underline"
                        style={{ color: COLORS.slate }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
