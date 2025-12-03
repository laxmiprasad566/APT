import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, RefreshCw } from "lucide-react";
import { api } from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDuration } from "@/lib/utils";

import type { TripPlan } from "@/types/index";

const fetchRecentTrips = async (): Promise<TripPlan[]> => {
  try {
    const data = await api.getTripPlans();
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const RecentTrips = () => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["recent-trips"],
    queryFn: fetchRecentTrips,
    staleTime: 60 * 1000,
  });

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Latest trip plans</h2>
            <p className="text-muted-foreground">
              Inspiration from the community. Reuse proven combinations or benchmark travel KPIs.
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="py-8 text-center text-destructive">
              Could not fetch recent trips. Ensure the trip_plans table has public SELECT access.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {isLoading
              ? Array.from({ length: 2 }).map((_, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))
              : (data || []).map((trip) => (
                <Card key={trip.id} className="border border-border/70">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {trip.origin_name || "Origin TBD"} → {trip.destination_name || "Destination TBD"}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(trip.travel_date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                      {trip.occasion && (
                        <Badge variant="secondary" className="ml-2 capitalize">
                          {trip.occasion}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Total cost</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(trip.total_cost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total duration</span>
                      <span className="font-semibold text-foreground">
                        {formatDuration(trip.total_duration)}
                      </span>
                    </div>
                    {trip.created_at && (
                      <p className="text-xs text-muted-foreground/80">
                        Planned {new Date(trip.created_at).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            {!isLoading && data && data.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No trip plans saved yet. Be the first to plan a journey!
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

