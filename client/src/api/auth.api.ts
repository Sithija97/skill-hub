import api from "./client";
import type { IUser } from "@/models/user";

type BackendUser = {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "user";
};

const mapUser = (u: BackendUser): IUser => ({
  id: u.id,
  email: u.email,
  fullName: u.full_name,
  role: u.role,
});

export const register = (data: {
  email: string;
  fullName: string;
  password: string;
}) =>
  api.post("/auth/register", {
    email: data.email,
    full_name: data.fullName,
    password: data.password,
  });

export const login = (data: { email: string; password: string }) =>
  api.post<{ accessToken: string }>("/auth/login", data);

export const getMe = () =>
  api
    .get<BackendUser>("/auth/me")
    .then((res) => ({ ...res, data: mapUser(res.data) }));

export const logout = () => api.post("/auth/logout");
