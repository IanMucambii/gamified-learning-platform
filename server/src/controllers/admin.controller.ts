import { Request, Response, NextFunction } from "express";
import { getAdminDashboard } from "../services/admin.service";

export async function getAdminDashboardHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getAdminDashboard();
    res.json(data);
  } catch (error) {
    next(error);
  }
}