import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      message: "Validation error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  console.error("[Unhandled Error]", err);
  res.status(500).json({ message: "Internal server error" });
};
