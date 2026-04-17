import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";
import { UserRole } from "../enums/user.enums.js";
import { config } from "../config.js";

export const seed = async (): Promise<void> => {
  const existing = await prisma.user.findUnique({
    where: { email: config.admin.email },
  });
  if (existing) return;

  const hashed = await bcrypt.hash(config.admin.password, 12);
  await prisma.user.create({
    data: {
      email: config.admin.email,
      full_name: "Administrator",
      password: hashed,
      role: UserRole.ADMIN,
    },
  });
  console.log(`[Seed] Admin user created: ${config.admin.email}`);
};
