export const VALID_TYPES = ["queue_joined", "close_to_served"];
export const MAX_MESSAGE_LENGTH = 300;

/** Validates the fields needed to create a notification (required fields, types, length limits). */
export function validateNotification({ userId, type, message }) {
  const errors = {};

  if (userId === undefined || userId === null || userId === "" || Number.isNaN(Number(userId))) {
    errors.userId = "A valid userId is required.";
  }

  if (typeof type !== "string" || !type.trim()) {
    errors.type = "Notification type is required.";
  } else if (!VALID_TYPES.includes(type)) {
    errors.type = `Type must be one of: ${VALID_TYPES.join(", ")}.`;
  }

  if (typeof message !== "string" || !message.trim()) {
    errors.message = "Notification message is required.";
  } else if (message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.`;
  }

  return errors;
}

/** Validates a notification id path param (used by the mark-as-read route). */
export function validateNotificationId(id) {
  const errors = {};
  if (id === undefined || id === null || id === "" || Number.isNaN(Number(id))) {
    errors.id = "A valid notification id is required.";
  }
  return errors;
}
