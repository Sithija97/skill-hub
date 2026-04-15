import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Response } from "express";
import { config } from "../config.js";
import { AppError } from "../common/errors/app-error.js";
import type { RegisterBody, LoginBody } from "../common/schemas/auth.schema.js";
import * as usersService from "../users/users.service.js";
import type { JwtPayload } from "./auth.middleware.js";
import { UserRole } from "../db/models/user.model.js";

const SALT_ROUNDS = 12;
const REFRESH_COOKIE = "refreshToken";

const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);

const setRefreshCookie = (res: Response, token: string): void => {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    maxAge,
  });
};

export const register = async (body: RegisterBody) => {
  const existing = await usersService.findByEmail(body.email);
  if (existing) throw new AppError(409, "Email already in use");

  const hashed = await bcrypt.hash(body.password, SALT_ROUNDS);
  const user = await usersService.createUser({
    email: body.email,
    full_name: body.full_name,
    password: hashed,
    role: UserRole.USER,
  });

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  };
};

export const login = async (body: LoginBody, res: Response) => {
  const user = await usersService.findByEmailWithSecrets(body.email);
  if (!user) throw new AppError(401, "Invalid credentials");

  const valid = await bcrypt.compare(body.password, user.password);
  if (!valid) throw new AppError(401, "Invalid credentials");

  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await usersService.updateRefreshToken(user.id, hashToken(refreshToken));
  setRefreshCookie(res, refreshToken);

  return {
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  };
};

export const refresh = async (
  rawRefreshToken: string | undefined,
  res: Response,
) => {
  if (!rawRefreshToken) throw new AppError(401, "Refresh token missing");

  let payload: JwtPayload;
  try {
    payload = jwt.verify(
      rawRefreshToken,
      config.jwt.refreshSecret,
    ) as unknown as JwtPayload;
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const user = await usersService.findByIdWithRefreshToken(payload.sub);
  if (!user || !user.refresh_token)
    throw new AppError(401, "Refresh token revoked");

  const incoming = hashToken(rawRefreshToken);
  if (incoming !== user.refresh_token)
    throw new AppError(401, "Refresh token mismatch");

  const newPayload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(newPayload);

  await usersService.updateRefreshToken(user.id, hashToken(newRefreshToken));
  setRefreshCookie(res, newRefreshToken);

  return { accessToken };
};

export const logout = async (userId: number, res: Response) => {
  await usersService.updateRefreshToken(userId, null);
  res.clearCookie(REFRESH_COOKIE);
};

export const me = async (userId: number) => {
  const user = await usersService.findById(userId);
  if (!user) throw new AppError(404, "User not found");
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  };
};
