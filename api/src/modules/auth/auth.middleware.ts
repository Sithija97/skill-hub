import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { AppError } from "../../common/errors/app-error.js";
import type { UserRole } from "@prisma/client";

export type { UserRole };

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateJwt = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid authorization header"));
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(
      token,
      config.jwt.secret,
    ) as unknown as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token"));
  }
};

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, "Unauthenticated"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Insufficient permissions"));
    }
    next();
  };
