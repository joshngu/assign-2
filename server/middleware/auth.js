import { getUserForToken } from "../modules/auth/auth.service.js";
import { ApiError } from "../utils/ApiError.js";

function extractToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" ? token : null;
}

export function requireAuth(req, res, next) {
  const token = extractToken(req);
  const user = getUserForToken(token);
  if (!user) {
    throw new ApiError(401, "Authentication required.");
  }
  req.user = user;
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Administrator access required.");
  }
  next();
}
