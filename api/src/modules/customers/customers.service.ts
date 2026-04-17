import type { Prisma } from "@prisma/client";
import { AppError } from "../../common/errors/app-error.js";
import {
  CustomerStatus,
  EngagementLevel,
  RiskLevel,
} from "../../enums/customer.enums.js";
import type { PaginatedResult } from "../../types/pagination.types.js";
import type {
  CreateCustomerBody,
  UpdateCustomerBody,
  CustomerQuery,
} from "../../schemas/customer.schema.js";
import { computeHealthScore, computeRiskLevel } from "./customers.business.js";
import * as customersRepository from "./customers.repository.js";
import type { CustomerWithOwner } from "./customers.repository.js";

// ─── Internal types ───────────────────────────────────────────────────────────

interface DerivedInput {
  mrr: number | Prisma.Decimal;
  engagement_level: EngagementLevel;
  last_activity_at: Date | null;
  renewal_date: Date | null;
}

interface DerivedOutput {
  health_score: number;
  risk_level: RiskLevel;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeDerivedFields(entity: DerivedInput): DerivedOutput {
  const mrr =
    typeof entity.mrr === "object" ? entity.mrr.toNumber() : entity.mrr;

  const health_score = computeHealthScore({
    lastActivityAt: entity.last_activity_at,
    engagementLevel: entity.engagement_level,
    mrr,
  });

  const risk_level = computeRiskLevel({
    healthScore: health_score,
    lastActivityAt: entity.last_activity_at,
    renewalDate: entity.renewal_date,
  });

  return { health_score, risk_level };
}

function deriveStatus(
  currentStatus: CustomerStatus,
  riskLevel: RiskLevel,
): CustomerStatus {
  if (currentStatus === CustomerStatus.CHURNED) return CustomerStatus.CHURNED;
  return riskLevel === RiskLevel.HIGH
    ? CustomerStatus.AT_RISK
    : CustomerStatus.ACTIVE;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function getCustomers(
  query: CustomerQuery,
): Promise<PaginatedResult<CustomerWithOwner>> {
  const { filter, sort, order, page, limit, search } = query;
  const { data, total } = await customersRepository.findMany({
    filter,
    sort,
    order,
    page,
    limit,
    search,
  });

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getCustomerById(id: string): Promise<CustomerWithOwner> {
  const customer = await customersRepository.findById(id);
  if (!customer) throw new AppError(404, "Customer not found");
  return customer;
}

export async function createCustomer(
  body: CreateCustomerBody,
): Promise<CustomerWithOwner> {
  const engagement_level = body.engagement_level ?? EngagementLevel.MEDIUM;
  const last_activity_at = body.last_activity_at ?? null;
  const renewal_date = body.renewal_date ?? null;

  const derived = computeDerivedFields({
    mrr: body.mrr,
    engagement_level,
    last_activity_at,
    renewal_date,
  });

  const status =
    body.status ?? deriveStatus(CustomerStatus.ACTIVE, derived.risk_level);

  return customersRepository.create({
    name: body.name,
    account_owner: { connect: { id: body.account_owner_id } },
    mrr: body.mrr,
    engagement_level,
    last_activity_at,
    renewal_date,
    health_score: derived.health_score,
    risk_level: derived.risk_level,
    status,
  });
}

export async function updateCustomer(
  id: string,
  body: UpdateCustomerBody,
): Promise<CustomerWithOwner> {
  const existing = await customersRepository.findById(id);
  if (!existing) throw new AppError(404, "Customer not found");

  const merged: DerivedInput = {
    mrr: body.mrr ?? existing.mrr,
    engagement_level: (body.engagement_level ??
      existing.engagement_level) as EngagementLevel,
    last_activity_at:
      body.last_activity_at !== undefined
        ? body.last_activity_at
        : existing.last_activity_at,
    renewal_date:
      body.renewal_date !== undefined
        ? body.renewal_date
        : existing.renewal_date,
  };

  const derived = computeDerivedFields(merged);
  const risk_level = body.risk_level ?? derived.risk_level;
  const status = body.status
    ? (body.status as CustomerStatus)
    : deriveStatus(existing.status as CustomerStatus, risk_level);

  const data: Prisma.CustomerUpdateInput = {
    ...(body.name !== undefined && { name: body.name }),
    ...(body.account_owner_id !== undefined && {
      account_owner: { connect: { id: body.account_owner_id } },
    }),
    ...(body.mrr !== undefined && { mrr: body.mrr }),
    ...(body.engagement_level !== undefined && {
      engagement_level: body.engagement_level,
    }),
    ...(body.last_activity_at !== undefined && {
      last_activity_at: body.last_activity_at,
    }),
    ...(body.renewal_date !== undefined && { renewal_date: body.renewal_date }),
    health_score: derived.health_score,
    risk_level,
    status,
  };

  const updated = await customersRepository.update(id, data);
  if (!updated) throw new AppError(404, "Customer not found");
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  const deleted = await customersRepository.remove(id);
  if (!deleted) throw new AppError(404, "Customer not found");
}
