import { EngagementLevel, RiskLevel } from "../../enums/customer.enums.js";
import {
  MRR_HIGH_THRESHOLD,
  MRR_MEDIUM_THRESHOLD,
  INACTIVITY_LOW_DAYS,
  INACTIVITY_MEDIUM_DAYS,
  INACTIVITY_HIGH_DAYS,
  RENEWAL_SOON_DAYS,
  INACTIVE_THRESHOLD_DAYS,
} from "./customers.constants.js";

// ─── Shared Helpers ───────────────────────────────────────────────────────────

export function diffInDays(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export function isInactiveLongEnough(lastActivityAt: Date | null): boolean {
  if (!lastActivityAt) return true;
  return diffInDays(new Date(), lastActivityAt) >= INACTIVE_THRESHOLD_DAYS;
}

export function isRenewalWithinDays(
  renewalDate: Date | null,
  days: number,
): boolean {
  if (!renewalDate) return false;
  const now = new Date();
  const daysUntilRenewal = diffInDays(renewalDate, now);
  return daysUntilRenewal >= 0 && daysUntilRenewal <= days;
}

// ─── Health Score ─────────────────────────────────────────────────────────────
// Scoring weights (max 100):
//   Activity recency → max 40
//   Engagement level → max 40
//   MRR tier         → max 20

function calcActivityScore(lastActivityAt: Date | null): number {
  if (!lastActivityAt) return 0;
  const daysSince = diffInDays(new Date(), lastActivityAt);
  if (daysSince <= INACTIVITY_LOW_DAYS) return 40;
  if (daysSince <= INACTIVITY_MEDIUM_DAYS) return 25;
  if (daysSince <= INACTIVITY_HIGH_DAYS) return 10;
  return 0;
}

function calcEngagementScore(engagementLevel: EngagementLevel): number {
  switch (engagementLevel) {
    case EngagementLevel.HIGH:
      return 40;
    case EngagementLevel.MEDIUM:
      return 25;
    case EngagementLevel.LOW:
      return 10;
  }
}

function calcMrrScore(mrr: number): number {
  if (mrr >= MRR_HIGH_THRESHOLD) return 20;
  if (mrr >= MRR_MEDIUM_THRESHOLD) return 12;
  return 5;
}

export function computeHealthScore(params: {
  lastActivityAt: Date | null;
  engagementLevel: EngagementLevel;
  mrr: number;
}): number {
  const score =
    calcActivityScore(params.lastActivityAt) +
    calcEngagementScore(params.engagementLevel) +
    calcMrrScore(params.mrr);

  return Math.min(100, Math.max(0, score));
}

// ─── Risk Level ───────────────────────────────────────────────────────────────

export function computeRiskLevel(params: {
  healthScore: number;
  lastActivityAt: Date | null;
  renewalDate: Date | null;
}): RiskLevel {
  const { healthScore, lastActivityAt, renewalDate } = params;

  const inactive = isInactiveLongEnough(lastActivityAt);
  const renewingSoon = isRenewalWithinDays(renewalDate, RENEWAL_SOON_DAYS);

  if (healthScore < 30) return RiskLevel.HIGH;
  if (inactive && renewingSoon) return RiskLevel.HIGH;
  if (inactive || renewingSoon) return RiskLevel.MEDIUM;
  if (healthScore < 60) return RiskLevel.MEDIUM;

  return RiskLevel.LOW;
}
