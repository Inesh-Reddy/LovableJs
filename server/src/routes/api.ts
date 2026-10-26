import { Router } from "express";
import { getHealth } from "../controllers/healthController";
import { projectRouter } from "./project.router";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);
apiRouter.use("/projects", projectRouter);
