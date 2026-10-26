import type { Request, Response } from "express";
import { getAllProjects } from "../services/projectService";

export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    return res.status(200).json({ data: projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch projects" });
  }
};
