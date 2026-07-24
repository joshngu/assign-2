import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

import { COLORS } from "./QueueSmartAuth";
import { fetchNotifications, markNotificationRead as apiMarkNotificationRead } from "./api";

// Human-readable labels for the backend's notification `type` field.
const TYPE_LABELS = {
  queue_joined: "Queue joined",
  close_to_served: "Almost your turn",
};

function fromBackendNotification(n) {
  return {
    id: n.id,
    title: TYPE_LABELS[n.type] || "Notification",
    body: n.message,
    read: n.read,
    ts: new Date(n.createdAt).getTime(),
  };
}

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

export function NotificationProvider({ children, token = null }) {
  const [items, setItems] = useState([]);
  // Locally-created notifications (from the still-mocked queue screens) get
  // string ids so they never collide with numeric ids from the backend.
  const idRef = useRef(1);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setItems([]);
      return undefined;
    }
    fetchNotifications(token)
      .then(({ notifications }) => {
        if (cancelled) return;
        setItems(notifications.map(fromBackendNotification));
      })
      .catch(() => {
        // Best-effort: leave notifications empty if the backend call fails.
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const notify = useCallback(({ title, body }) => {
    const item = {
      id: `local-${idRef.current++}`,
      title,
      body,
      read: false,
      ts: Date.now(),
    };
    setItems((prev) => [item, ...prev]);
  }, []);

  const markRead = useCallback(
    (id) => {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      // Only sync to the backend for real, numeric backend-sourced ids.
      if (token && typeof id === "number") {
        apiMarkNotificationRead(token, id).catch(() => {
          // Best-effort sync; the optimistic local update already applied.
        });
      }
    },
    [token]
  );

  const markAllRead = useCallback(() => {
    setItems((prev) => {
      if (token) {
        prev
          .filter((n) => !n.read && typeof n.id === "number")
          .forEach((n) => {
            apiMarkNotificationRead(token, n.id).catch(() => {});
          });
      }
      return prev.map((n) => ({ ...n, read: true }));
    });
  }, [token]);

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
