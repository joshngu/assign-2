import { db } from "../../data/store.js";
import { ApiError } from "../../utils/ApiError.js";
import { validateService } from "./services.validation.js";

export function listServices() {
  return db.services;
}

export function createService({ name, description, duration, priority }) {
  const errors = validateService({ name, description, duration, priority });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  const service = {
    id: db.nextServiceId++,
    name: name.trim(),
    description: description.trim(),
    duration: Number(duration),
    priority,
  };
  db.services.push(service);
  return service;
}

export function updateService(id, { name, description, duration, priority }) {
  const service = db.services.find((s) => s.id === Number(id));
  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  const errors = validateService({ name, description, duration, priority });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, "Validation failed", errors);
  }

  service.name = name.trim();
  service.description = description.trim();
  service.duration = Number(duration);
  service.priority = priority;
  return service;
}
