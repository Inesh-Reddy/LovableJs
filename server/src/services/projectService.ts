import type { Project } from "../../generated/prisma/client";
import { findAllProjects } from "../repositories/projectRepository";

export async function getAllProjects(): Promise<Project[]> {
  return findAllProjects();
}
