import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { Role } from "../models/User";
import { env } from "../env";
import { console } from "inspector/promises";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try{
    const { name, email, password, role} = req.body as {
      name: string,
      email: string,
      password: string,
      role: Role
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ message: "Email already Registered" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role});

    res.status(201).json({
      id: user._id,
      name: user.name,
      role: user.role,
      isApproved:user.isApproved
    });
  } catch(error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as {email: string, password: string}
    console.log("Login request received:", { email, passwordLength: password.length }); // Log the request data for debugging

    const user = await User.findOne({ email});
    if (!user) {
      res.status(401).json({ message: "Invalid Credentials"});
      return;
    }

    const match = await bcrypt.compare( password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET as string, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role }});
  } catch(error) {
    next(error);
  }
}
