import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";
import { ApiError } from "../../utils/ApiError.js";
import * as notificationsService from "./notifications.service.js";

export const notificationsRouter = Router();

// A user sees only their own notifications, based on their auth token.
notificationsRouter.get("/", requireAuth, (req, res) => {
  const notifications = notificationsService.listNotificationsForUser(req.user.id);
  res.status(200).json({ notifications });
});

notificationsRouter.post("/:id/read", requireAuth, (req, res) => {
  const notification = notificationsService.markNotificationRead(req.params.id, req.user.id);
  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }
  res.status(200).json({ notification });
});
