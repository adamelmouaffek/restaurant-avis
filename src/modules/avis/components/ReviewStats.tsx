"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { TrendingUp, BarChart3, Calendar, ArrowRightLeft } from "lucide-react";

interface ReviewStatsProps {
  nps: number;
  ratingDistribution: { star: number; count: number; pct: number }[];
  dailyTrend: { date: string; count: number; avg: number }[];
  conversionRate: number;
  totalReviews: number;
  recentCount: number;
}

function NpsGauge({ nps }: { nps: number }) {
  // NPS ranges from -100 to 100
  const color =
    nps >= 50
      ? "text-green-600"
      : nps >= 0
        ? "text-amber-600"
        : "text-red-600";
  const bg =
    nps >= 50
      ? "bg-green-50"
      : nps >= 0
        ? "bg-amber-50"
        : "bg-red-50";
  const label =
    nps >= 50
      ? "Excellent"
      : nps >= 20
        ? "Bon"
        : nps >= 0
          ? "Correct"
          : "A ameliorer";

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
            <TrendingUp className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Net Promoter Score
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${color}`}>{nps}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
        <p className={`text-sm mt-1 ${color}`}>{label}</p>
        {/* NPS bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              nps >= 50
                ? "bg-green-500"
                : nps >= 0
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${Math.max(0, ((nps + 100) / 200) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>-100</span>
          <span>0</span>
          <span>100</span>
        </div>
      </CardContent>
    </Card>
  );
}

function RatingDistribution({
  distribution,
}: {
  distribution: { star: number; count: number; pct: number }[];
}) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
            <BarChart3 className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Repartition des notes
          </p>
        </div>
        <div className="space-y-3">
          {[...distribution].reverse().map((d) => (
            <div key={d.star} className="flex items-center gap-3">
              <span className="text-sm font-medium w-6 text-right">
                {d.star}★
              </span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{
                    width: `${(d.count / maxCount) * 100}%`,
                    minWidth: d.count > 0 ? "8px" : "0",
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-16 text-right">
                {d.count} ({d.pct}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DailyTrend({
  data,
  recentCount,
}: {
  data: { date: string; count: number; avg: number }[];
  recentCount: number;
}) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Avis des 30 derniers jours
            </p>
          </div>
          <span className="text-2xl font-bold text-blue-600">{recentCount}</span>
        </div>
        {/* Mini bar chart */}
        <div className="flex items-end gap-[2px] h-24">
          {data.map((d) => (
            <div
              key={d.date}
              className="flex-1 group relative"
              title={`${d.date}: ${d.count} avis${d.avg > 0 ? ` (moy: ${d.avg})` : ""}`}
            >
              <div
                className="w-full bg-blue-400 rounded-t-sm transition-all hover:bg-blue-600"
                style={{
                  height: `${d.count > 0 ? Math.max((d.count / maxCount) * 100, 8) : 0}%`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>
            {new Date(data[0]?.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <span>
            {new Date(data[data.length - 1]?.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ConversionCard({
  rate,
  totalReviews,
}: {
  rate: number;
  totalReviews: number;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
            <ArrowRightLeft className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Taux de conversion roue
          </p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-purple-600">{rate}%</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          des {totalReviews} avis ont tourne la roue
        </p>
        {/* Progress bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewStats({
  nps,
  ratingDistribution,
  dailyTrend,
  conversionRate,
  totalReviews,
  recentCount,
}: ReviewStatsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <NpsGauge nps={nps} />
      <RatingDistribution distribution={ratingDistribution} />
      <DailyTrend data={dailyTrend} recentCount={recentCount} />
      <ConversionCard rate={conversionRate} totalReviews={totalReviews} />
    </div>
  );
}
