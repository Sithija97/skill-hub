import { prisma } from "../../db/prisma.js";
import type { User } from "@prisma/client";

export const findByEmail = (email: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { email } });

export const findByEmailWithSecrets = (email: string): Promise<User | null> =>
  prisma.user.findUnique({ where: { email } });

export const findById = (
  id: number,
): Promise<Omit<User, "password" | "refresh_token"> | null> =>
  prisma.user.findUnique({
    where: { id },
    omit: { password: true, refresh_token: true },
  });

export const findByIdWithRefreshToken = (id: number): Promise<User | null> =>
  prisma.user.findUnique({ where: { id } });

export const createUser = (data: {
  email: string;
  full_name: string;
  password: string;
  role: User["role"];
}): Promise<User> => prisma.user.create({ data });

export const updateRefreshToken = (
  id: number,
  hashedToken: string | null,
): Promise<User> =>
  prisma.user.update({
    where: { id },
    data: { refresh_token: hashedToken },
  });
