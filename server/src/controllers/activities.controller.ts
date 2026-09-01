import { Request, Response, NextFunction } from 'express';
import { getAllActivities } from '../services/activities.service';

export async function listActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const activities = await getAllActivities(req.user!._id);
    res.json(activities);
  } catch (err) {
    next(err);
  }
}