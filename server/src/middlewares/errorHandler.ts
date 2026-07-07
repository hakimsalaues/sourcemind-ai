import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: env.nodeEnv === "development" ? err.message : undefined,
  });
};
