import { z } from "zod";

const customerTypeValues = [
  "Individual",
  "Business",
  "Enterprise",
  "Partner",
  "Reseller",
  "Other",
] as const;

const customerIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Customer id must be a positive integer")
    .refine((value) => Number(value) > 0, "Customer id must be greater than 0"),
});

const createCustomerSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email format"),
  phone_number: z
    .string()
    .trim()
    .regex(/^[\d\s\-+()]+$/, "Invalid phone number format")
    .min(1, "Phone number is required"),
  address: z.string().trim().optional(),
  country: z.string().trim().optional(),
  customer_type: z.enum(customerTypeValues).optional(),
});

const updateCustomerSchema = createCustomerSchema.partial();

type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export {
  customerIdParamSchema,
  createCustomerSchema,
  updateCustomerSchema,
  customerTypeValues,
};

export type { CreateCustomerInput, UpdateCustomerInput };
