import { db } from "../../data/store.js";
import { ApiError } from "../../utils/ApiError.js";
import { validateNotification, validateNotificationId } from "./notifications.validation.js";

/*
 * Notification Module.
 * Backend logic to trigger notifications when a user joins a queue or is
 * close to being served. Per assignment scope, notifications are logged
 * in-memory and returned to the front end (no real email/SMS).
 */

function toPublicNotification(notification) {
  return {
    id: notification.id,
    userId: notification.userId,
    type: notification.type,
    message: notification.message,
    createdAt: notification.createdAt,
    read: notification.read,
  };
}

export function notify(userId, type, message) {
  const errors = validateNotification({ userId, type, message });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const notification = {
    id: db.nextNotificationId++,
    userId,
    type,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.notifications.push(notification);
  return toPublicNotification(notification);
}

/** Called when a user joins a queue for a service. */
export function notifyQueueJoined(userId, serviceName) {
  return notify(userId, "queue_joined", `You joined the queue for ${serviceName}.`);
}

/** Called when a user's estimated wait drops to/below the "almost up" threshold. */
export function notifyCloseToServed(userId, serviceName, estimatedWaitMinutes) {
  return notify(
    userId,
    "close_to_served",
    `You are almost up for ${serviceName}. Estimated wait: ${estimatedWaitMinutes} minutes.`
  );
}

export function listNotificationsForUser(userId) {
  return db.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id)
    .map(toPublicNotification);
}

export function markNotificationRead(notificationId, userId) {
  const errors = validateNotificationId(notificationId);
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const notification = db.notifications.find((n) => n.id === Number(notificationId));
  if (!notification || notification.userId !== userId) {
    return null;
  }
  notification.read = true;
  return toPublicNotification(notification);
}
