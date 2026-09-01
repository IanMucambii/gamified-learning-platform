import { Request, Response, NextFunction } from 'express';
import { getPatientDashboard } from '../services/dashboard.service';

export async function getMyDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dashboard = await getPatientDashboard(req.user!._id);
    res.json(dashboard);
  } catch (err) {
    next(err);
  }
}