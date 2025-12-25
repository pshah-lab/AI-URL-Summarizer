import { Request, Response, NextFunction } from "express";

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("❌ Error:", err.message);

  return res.status(500).json({
    message: "Internal server error",
  });
};