import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized: token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;

    if (!decoded.userId) {
      throw new AppError("Unauthorized: invalid token", 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError("Unauthorized: user not found", 401);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
