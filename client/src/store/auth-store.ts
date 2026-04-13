import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  clearStoredUser,
  readStoredUser,
  storeUser,
  type AuthUser,
} from "@/lib/auth-storage";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
};

const initialUser = readStoredUser();

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: initialUser,
      isAuthenticated: Boolean(initialUser),
      login: async ({ email }) => {
        const nextUser: AuthUser = {
          name: email.split("@")[0] || "User",
          email,
        };

        storeUser(nextUser);
        set({ user: nextUser, isAuthenticated: true }, false, "auth/login");
      },
      register: async ({ name, email }) => {
        const nextUser: AuthUser = {
          name,
          email,
        };

        storeUser(nextUser);
        set({ user: nextUser, isAuthenticated: true }, false, "auth/register");
      },
      logout: () => {
        clearStoredUser();
        set({ user: null, isAuthenticated: false }, false, "auth/logout");
      },
    }),
    { name: "AuthStore" },
  ),
);
