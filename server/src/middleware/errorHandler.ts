import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error(err);

  if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: err.message || "Server Errorr" });
}