import { Request, Response, NextFunction } from "express";
import User from "../models/User";

// Admin: list all users
export async function getUsers(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch(error) {
    next(error)
  }
}

// Admin: approve a doctor
export async function approveDoctor(req: Request, res: Response, next: NextFunction): Promise <void> {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "Doctor") {
      res.status(404).json({ message: "Professor not Found" });
      return;
    }

    user.isApproved = true;
    await user.save();
    res.json({ message: "Doctor Approved", user });
  } catch(error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction ): Promise <void> {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { next: true }).select("-password");
    res.json(user);
  } catch(error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction ): Promise <void> {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted Successfully"});
  } catch(error) {
    next(error);
  }  
}

// controllers/userController.ts

// Patient/Doctor: get own profile
export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user?._id)
      .select("-password")
      .populate("supervisor", "name email");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}