import { Request, Response, NextFunction } from "express";
import { Role } from "../models/User";

export default function role(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Access Denied"});
      return;
    }
    next();
  }
}