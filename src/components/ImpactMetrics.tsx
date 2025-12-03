import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Globe2, Activity, Clock } from "lucide-react";
import { api } from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDuration } from "@/lib/utils";
import type { TripMetrics } from "@/types/index";
import { FALLBACK_METRICS } from "@/data/fallbacks";

const fetchTripMetrics = async (): Promise<TripMetrics> => {
  try {
    const data = await api.getMetrics();
    return data as TripMetrics;
  } catch (error) {
    console.warn("Falling back to offline metrics:", error);
    return FALLBACK_METRICS;
  }
};

export const ImpactMetrics = () => {
  const { data, isLoading, error } = useQuery<TripMetrics>({
    queryKey: ["trip-metrics"],
    queryFn: fetchTripMetrics,
    staleTime: 60 * 1000,
  });

  const metrics = useMemo(
    () => [
      {
        label: "Trips Planned",
        value: data?.totalTrips ?? 0,
        helper: "since launch",
        icon: TrendingUp,
      },
      {
        label: "Avg. Trip Cost",
        value: formatCurrency(data?.avgCost ?? 0),
        helper: "across all modes",
        icon: Activity,
      },
      {
        label: "Avg. Duration",
        value: formatDuration(data?.avgDuration ?? null),
        helper: "door-to-door",
        icon: Clock,
      },
      {
        label: "Coverage",
        value: `${data?.originCoverage ?? 0} → ${data?.destinationCoverage ?? 0}`,
        helper: "origins vs destinations",
        icon: Globe2,
      },
    ],
    [data],
  );

  return (
    <section id="impact" className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wide">
            Impact Dashboard
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Real-time performance of APT Planner
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every trip planned feeds back into our optimization engine. Monitor how APT is saving
            time and money for travelers across the region.
          </p>
        </div>

        {error ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="py-8 text-center text-destructive">
              Unable to load live metrics right now. Please verify your Supabase credentials.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className="shadow-[var(--shadow-elegant)]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {metric.label}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground/80">{metric.helper}</p>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <p className="text-2xl font-semibold">{metric.value}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Occasion insights
              {data?.lastTripAt && (
                <span className="text-xs font-normal text-muted-foreground">
                  Last trip recorded {new Date(data.lastTripAt).toLocaleString()}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  {(data?.occasionBreakdown || []).map((item) => (
                    <Badge key={item.occasion} variant="secondary" className="text-sm">
                      {item.occasion}: {item.tripCount} trips
                    </Badge>
                  ))}
                  {(!data || !data.occasionBreakdown || data.occasionBreakdown.length === 0) && (
                    <p className="text-muted-foreground text-sm">No trips recorded yet.</p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Top Origin:{" "}
                    <span className="font-semibold text-foreground">
                      {data?.topOrigin || "Pending first trip"}
                    </span>
                  </p>
                  <p>
                    Top Destination:{" "}
                    <span className="font-semibold text-foreground">
                      {data?.topDestination || "Pending first trip"}
                    </span>
                  </p>
                  <p>
                    Emergency Deployments:{" "}
                    <span className="font-semibold text-foreground">
                      {data?.emergencyTrips ?? 0} trips
                    </span>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

