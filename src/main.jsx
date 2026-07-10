import React from "react";
import { createRoot } from "react-dom/client";
import QueueSmartAuth from "./QueueSmartAuth";
import { NotificationProvider } from "./Notifications";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotificationProvider>
      <QueueSmartAuth />
    </NotificationProvider>
  </React.StrictMode>
);
