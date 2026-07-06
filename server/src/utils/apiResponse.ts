import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Operation completed successfully",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res: Response,
  message = "Something went wrong",
  statusCode = 500,
  error?: unknown,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
