import { Router } from "express";

import { requireAuth } from "../../middleware/auth.js";
import * as historyService from "./history.service.js";

export const historyRouter = Router();

// A user sees only their own queue history, based on their auth token.
historyRouter.get("/", requireAuth, (req, res) => {
  const history = historyService.listHistoryForUser(req.user.id);
  res.status(200).json({ history });
});
