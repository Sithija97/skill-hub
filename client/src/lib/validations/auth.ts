import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Minimum 6 characters")
    .nonempty("Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Minimum 2 characters")
      .nonempty("Name is required"),
    email: z.email("Enter a valid email"),
    password: z
      .string()
      .min(6, "Minimum 6 characters")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
