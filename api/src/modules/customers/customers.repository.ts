import type { Prisma } from "@prisma/client";
import { prisma } from "../../db/prisma.js";
import {
  CustomerStatus,
  EngagementLevel,
  RiskLevel,
} from "../../enums/customer.enums.js";
import type { FindManyOptions } from "../../types/customer.types.js";
import {
  MRR_HIGH_THRESHOLD,
  MRR_MEDIUM_THRESHOLD,
  RENEWAL_SOON_DAYS,
  INACTIVE_THRESHOLD_DAYS,
} from "./customers.constants.js";
import type { CustomerSort } from "../../schemas/customer.schema.js";

// ─── Return type ──────────────────────────────────────────────────────────────

export type CustomerWithOwner = Prisma.CustomerGetPayload<{
  include: { account_owner: true };
}>;

const withOwner = { account_owner: true } satisfies Prisma.CustomerInclude;

// ─── Filter builder ───────────────────────────────────────────────────────────

function buildWhere(
  filter: FindManyOptions["filter"],
  search?: string,
): Prisma.CustomerWhereInput {
  const now = new Date();
  const base: Prisma.CustomerWhereInput = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  switch (filter) {
    case "at_risk":
      return {
        ...base,
        OR: [
          { status: CustomerStatus.AT_RISK },
          { risk_level: RiskLevel.HIGH },
        ],
      };

    case "renewal_soon": {
      const limit = new Date(now);
      limit.setDate(limit.getDate() + RENEWAL_SOON_DAYS);
      return { ...base, renewal_date: { not: null, gte: now, lte: limit } };
    }

    case "high_value":
      return { ...base, mrr: { gte: MRR_HIGH_THRESHOLD } };

    case "inactive": {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - INACTIVE_THRESHOLD_DAYS);
      return {
        ...base,
        OR: [{ last_activity_at: null }, { last_activity_at: { lte: cutoff } }],
      };
    }

    case "growth_opportunities":
      return {
        ...base,
        engagement_level: EngagementLevel.HIGH,
        mrr: { gte: MRR_MEDIUM_THRESHOLD, lt: MRR_HIGH_THRESHOLD },
      };

    case "churned":
      return { ...base, status: CustomerStatus.CHURNED };

    default:
      return base;
  }
}

const SORT_MAP: Record<
  CustomerSort,
  keyof Prisma.CustomerOrderByWithRelationInput
> = {
  mrr: "mrr",
  health_score: "health_score",
  last_activity_at: "last_activity_at",
  renewal_date: "renewal_date",
  created_at: "created_at",
  name: "name",
};

// ─── Repository ───────────────────────────────────────────────────────────────

export async function findMany(
  options: FindManyOptions,
): Promise<{ data: CustomerWithOwner[]; total: number }> {
  const {
    filter = "all",
    sort = "created_at",
    order = "DESC",
    page,
    limit,
    search,
  } = options;

  const where = buildWhere(filter, search);
  const orderBy: Prisma.CustomerOrderByWithRelationInput = {
    [SORT_MAP[sort] ?? "created_at"]: order.toLowerCase(),
  };
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      include: withOwner,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.customer.count({ where }),
  ]);

  return { data, total };
}

export function findById(id: string): Promise<CustomerWithOwner | null> {
  return prisma.customer.findUnique({ where: { id }, include: withOwner });
}

export function create(
  data: Prisma.CustomerCreateInput,
): Promise<CustomerWithOwner> {
  return prisma.customer.create({ data, include: withOwner });
}

export async function update(
  id: string,
  data: Prisma.CustomerUpdateInput,
): Promise<CustomerWithOwner | null> {
  try {
    return await prisma.customer.update({
      where: { id },
      data,
      include: withOwner,
    });
  } catch {
    return null;
  }
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.customer.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
