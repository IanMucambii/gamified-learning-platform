import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { env } from "../env";

interface JwtPayload{
  id: string;
}

export default async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({message: "Token not provided"});
    return
  }

  try{
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not Found" });
      return;
    }

    if (user.role === "Doctor" && !user.isApproved) {
      res.status(403).json({ message: "Doctor Account Pedding Approbal" });
      return;
    }

    req.user = user;
    next();
  } catch( error ) {
    res.status(401).json({ message: "Invalid Token"});
    return;
  }
}