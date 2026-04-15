import bcrypt from "bcrypt";
import { AppDataSource } from "../db/data-source.js";
import { UserEntity, UserRole } from "../db/models/user.model.js";
import { config } from "../config.js";

export const seed = async (): Promise<void> => {
  const repo = AppDataSource.getRepository(UserEntity);
  const existing = await repo.findOne({ where: { email: config.admin.email } });
  if (existing) return;

  const hashed = await bcrypt.hash(config.admin.password, 12);
  await repo.save(
    repo.create({
      email: config.admin.email,
      full_name: "Administrator",
      password: hashed,
      role: UserRole.ADMIN,
    }),
  );
  console.log(`[Seed] Admin user created: ${config.admin.email}`);
};
