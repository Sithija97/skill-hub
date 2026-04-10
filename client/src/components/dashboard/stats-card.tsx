import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardData {
  id: string;
  title: string;
  value: string;
  change: number;
  note: string;
}

interface StatsCardProps {
  stat: StatCardData;
}

export function StatsCard({ stat }: StatsCardProps) {
  const isPositive = stat.change >= 0;
  const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold tracking-tight">
              {stat.value}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{stat.note}</p>
          </div>
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                : "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-400",
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {Math.abs(stat.change)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
