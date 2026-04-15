import { AppDataSource } from "../db/data-source.js";
import { UserEntity } from "../db/models/user.model.js";

const repo = () => AppDataSource.getRepository(UserEntity);

export const findByEmail = (email: string) =>
  repo().findOne({ where: { email } });

export const findByEmailWithSecrets = (email: string) =>
  repo()
    .createQueryBuilder("user")
    .addSelect("user.password")
    .addSelect("user.refresh_token")
    .where("user.email = :email", { email })
    .getOne();

export const findById = (id: number) => repo().findOne({ where: { id } });

export const findByIdWithRefreshToken = (id: number) =>
  repo()
    .createQueryBuilder("user")
    .addSelect("user.refresh_token")
    .where("user.id = :id", { id })
    .getOne();

export const createUser = (data: Partial<UserEntity>) =>
  repo().save(repo().create(data));

export const updateRefreshToken = (id: number, hashedToken: string | null) =>
  repo().update(id, { refresh_token: hashedToken });
