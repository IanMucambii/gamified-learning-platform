import { Request, Response, NextFunction } from "express";
import { getAdminDashboard, getPatientsWithStats, getCaregiversList, getCaregiversWithStats, getActivitiesWithStats } from "../services/admin.service";

export async function getAdminDashboardHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getAdminDashboard();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await getPatientsWithStats();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

export const getCaregivers = async (req: Request, res: Response) => {
  try {
    const caregivers = await getCaregiversList();
    res.json(caregivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch caregivers" });
  }
};

// controller — new handler, doesn't touch getCaregivers (still used for the Patients dropdown)
export const getCaregiversDetailed = async (req: Request, res: Response) => {
  try {
    const caregivers = await getCaregiversWithStats();
    res.json(caregivers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch caregivers" });
  }
};

// controller
export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await getActivitiesWithStats();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};