import { z } from "zod";
import {
  CustomerStatus,
  EngagementLevel,
  RiskLevel,
} from "../enums/customer.enums.js";

// ─── Filter & Sort ────────────────────────────────────────────────────────────

export const customerFilterValues = [
  "all",
  "at_risk",
  "renewal_soon",
  "high_value",
  "inactive",
  "growth_opportunities",
  "churned",
] as const;

export type CustomerFilter = (typeof customerFilterValues)[number];

export const customerSortValues = [
  "mrr",
  "health_score",
  "last_activity_at",
  "renewal_date",
  "created_at",
  "name",
] as const;

export type CustomerSort = (typeof customerSortValues)[number];

// ─── Create ───────────────────────────────────────────────────────────────────

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  account_owner_id: z.number().int().positive("Account owner is required"),
  mrr: z.number().nonnegative("MRR must be non-negative"),
  engagement_level: z.nativeEnum(EngagementLevel).optional(),
  last_activity_at: z.coerce.date().optional().nullable(),
  renewal_date: z.coerce.date().optional().nullable(),
  status: z.nativeEnum(CustomerStatus).optional(),
});

export type CreateCustomerBody = z.infer<typeof createCustomerSchema>;

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateCustomerSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  account_owner_id: z.number().int().positive().optional(),
  mrr: z.number().nonnegative().optional(),
  engagement_level: z.nativeEnum(EngagementLevel).optional(),
  last_activity_at: z.coerce.date().optional().nullable(),
  renewal_date: z.coerce.date().optional().nullable(),
  status: z.nativeEnum(CustomerStatus).optional(),
  risk_level: z.nativeEnum(RiskLevel).optional(),
});

export type UpdateCustomerBody = z.infer<typeof updateCustomerSchema>;

// ─── Query ────────────────────────────────────────────────────────────────────

export const customerQuerySchema = z.object({
  filter: z.enum(customerFilterValues).optional().default("all"),
  sort: z.enum(customerSortValues).optional().default("created_at"),
  order: z.enum(["ASC", "DESC"]).optional().default("DESC"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().optional(),
});

export type CustomerQuery = z.infer<typeof customerQuerySchema>;
