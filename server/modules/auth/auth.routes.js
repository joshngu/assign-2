import { Router } from "express";

import * as authService from "./auth.service.js";

export const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const { email, password, role } = req.body ?? {};
  const result = authService.register({ email, password, role });
  res.status(201).json(result);
});

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const result = authService.login({ email, password });
  res.status(200).json(result);
});
