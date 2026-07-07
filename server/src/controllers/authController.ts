import { NextFunction, Request, Response } from "express";
import { authService } from "../services/authService";
import { sendSuccess } from "../utils/apiResponse";
import { AuthRequest } from "../middlewares/authMiddleware";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.register(req.body);

    return sendSuccess(res, result, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await authService.login(req.body);

    return sendSuccess(res, result, "User logged in successfully");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    return sendSuccess(
      res,
      {
        user: req.user,
      },
      "User retrieved successfully",
    );
  } catch (error) {
    next(error);
  }
};
