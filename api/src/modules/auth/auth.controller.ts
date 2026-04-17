import type { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "../../schemas/auth.schema.js";
import * as authService from "./auth.service.js";
import { authenticateJwt } from "./auth.middleware.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);
    const user = await authService.register(body);
    res.status(201).json({ message: "Registration successful", user });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);
    const data = await authService.login(body, res);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    const data = await authService.refresh(token, res);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const logout = [
  authenticateJwt,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await authService.logout(req.user!.sub, res);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  },
];

export const me = [
  authenticateJwt,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await authService.me(req.user!.sub);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
];
