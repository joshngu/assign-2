import express from "express";
import cors from "cors";

import { authRouter } from "./modules/auth/auth.routes.js";
import { servicesRouter } from "./modules/services/services.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRouter);
  app.use("/api/services", servicesRouter);

  app.use(errorHandler);

  return app;
}
