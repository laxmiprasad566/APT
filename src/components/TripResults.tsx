import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, DollarSign, Train, Bus, Plane, Ship, Car, Leaf, Zap, TramFront } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { BookingOptions } from "@/components/BookingOptions";

export interface PlannedRoute {
  id: string;
  type: string;
  segments: {
    mode: string;
    modeName?: string;
    from: string;
    to: string;
    duration: number;
    cost: number;
    departure: string;
    arrival: string;
    bookingLinks?: Array<{
      name: string;
      baseUrl: string;
      code: string;
    }>;
  }[];
  totalDuration: number;
  totalCost: number;
  score?: number;
  insight?: string;
  carbonEstimate?: number;
  coupon?: {
    code: string;
    value: number;
    description: string;
  };
}

interface TripResultsProps {
  routes: PlannedRoute[];
  searchParams: {
    origin: string;
    destination: string;
    date: string;
  };
  onModify: () => void;
}

const modeIcons: Record<string, LucideIcon> = {
  '1st_ac_train': Train,
  '2nd_ac_train': Train,
  '3rd_ac_train': Train,
  'sleeper_train': Train,
  'ac_bus': Bus,
  'non_ac_bus': Bus,
  'semi_sleeper_bus': Bus,
  'sleeper_bus': Bus,
  'economy_flight': Plane,
  'business_flight': Plane,
  'shared_taxi': Car,
  'private_ac_taxi': Car,
  'private_taxi': Car,
  'metro': TramFront,
  'auto_rickshaw': Zap,
  // Fallbacks
  train: Train,
  bus: Bus,
  air: Plane,
  water: Ship,
};

const modeColors: Record<string, string> = {
  '1st_ac_train': "text-primary",
  '2nd_ac_train': "text-primary",
  '3rd_ac_train': "text-primary",
  'sleeper_train': "text-primary",
  'ac_bus': "text-secondary",
  'non_ac_bus': "text-secondary",
  'semi_sleeper_bus': "text-secondary",
  'sleeper_bus': "text-secondary",
  'economy_flight': "text-accent",
  'business_flight': "text-accent",
  'shared_taxi': "text-info",
  'private_ac_taxi': "text-info",
  'private_taxi': "text-info",
  'metro': "text-success",
  'auto_rickshaw': "text-warning",
};

export const TripResults = ({ routes, searchParams, onModify }: TripResultsProps) => {
  const [filter, setFilter] = useState("standard");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const filteredRoutes = routes.filter(route => {
    if (filter === "luxury") return route.type === "luxury";
    if (filter === "speed") return route.type === "speed";
    return route.type === "standard";
  });

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              Trip Plans for Your Journey
            </h2>
            <p className="text-muted-foreground">
              {searchParams.origin} → {searchParams.destination} on {searchParams.date}
            </p>
          </div>
          <Button variant="outline" onClick={onModify}>
            Modify Search
          </Button>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-8">
          <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
            <TabsTrigger value="standard">Standard</TabsTrigger>
            <TabsTrigger value="luxury">Luxury</TabsTrigger>
            <TabsTrigger value="speed">Speed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-6">
          {filteredRoutes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No routes available for the selected filter. Try a different option.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRoutes.map((route, index) => (
              <Card
                key={route.id}
                className="hover:shadow-[var(--shadow-elegant)] transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="text-xl">
                      Route Option {index + 1}
                    </CardTitle>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(route.totalDuration)}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(route.totalCost)}
                      </Badge>
                      {route.carbonEstimate !== undefined && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Leaf className="w-4 h-4" />
                          {route.carbonEstimate.toFixed(1)} kg CO₂e
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {route.insight && (
                      <Badge variant="secondary" className="text-sm">
                        {route.insight}
                      </Badge>
                    )}
                    {route.segments.map((segment, segIndex) => {
                      const Icon = modeIcons[segment.mode] || Train;
                      const color = modeColors[segment.mode] || "text-primary";

                      return (
                        <div key={segIndex} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                          <div className={`mt-1 p-2 rounded-full bg-background ${color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{segment.modeName || segment.mode}</span>
                                <Badge variant="outline" className="text-xs">{segment.mode.replace(/_/g, ' ')}</Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {segment.departure} - {segment.arrival}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {segment.from} → {segment.to}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-muted-foreground">
                                Duration: {formatDuration(segment.duration)}
                              </span>
                              <span className="text-muted-foreground">
                                Cost: {formatCurrency(segment.cost)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {typeof route.score === "number" && (
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Reliability score</span>
                        <span className="font-semibold text-foreground">{route.score}%</span>
                      </div>
                      <Progress value={route.score} className="h-2" />
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <Link
                      to="/booking"
                      state={{ route: route, coupon: route.coupon }}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                      Book This Route
                    </Link>
                  </div>

                  {/* Show booking options when route is selected */}
                  {selectedRoute === route.id && route.segments[0].bookingLinks && route.coupon && (
                    <BookingOptions
                      bookingLinks={route.segments[0].bookingLinks}
                      coupon={route.coupon}
                      transportMode={route.segments[0].mode}
                    />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
