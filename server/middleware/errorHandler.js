import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.fieldErrors || undefined,
    });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error." });
}
