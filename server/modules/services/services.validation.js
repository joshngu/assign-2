const VALID_PRIORITIES = ["low", "medium", "high"];
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

export function validateService({ name, description, duration, priority }) {
  const errors = {};

  if (typeof name !== "string" || !name.trim()) {
    errors.name = "Service name is required.";
  } else if (name.trim().length > MAX_NAME_LENGTH) {
    errors.name = `Service name must not exceed ${MAX_NAME_LENGTH} characters.`;
  }

  if (typeof description !== "string" || !description.trim()) {
    errors.description = "Description is required.";
  } else if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
  }

  if (duration === "" || duration === null || duration === undefined) {
    errors.duration = "Expected duration is required.";
  } else {
    const durationValue = Number(duration);
    if (!Number.isFinite(durationValue) || !Number.isInteger(durationValue) || durationValue <= 0) {
      errors.duration = "Enter a whole number of minutes greater than 0.";
    }
  }

  if (!priority) {
    errors.priority = "Select a priority level.";
  } else if (!VALID_PRIORITIES.includes(priority)) {
    errors.priority = "Priority must be one of low, medium, or high.";
  }

  return errors;
}
