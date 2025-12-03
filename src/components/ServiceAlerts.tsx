import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ShieldCheck, Bell } from "lucide-react";
import { api } from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ServiceAlert } from "@/types/index";
import { FALLBACK_ALERTS } from "@/data/fallbacks";

const fetchServiceAlerts = async (): Promise<ServiceAlert[]> => {
  try {
    const data = await api.getServiceAlerts();
    if (!data || data.length === 0) {
      return FALLBACK_ALERTS;
    }
    return data;
  } catch (error) {
    console.warn("Falling back to offline alerts:", error);
    return FALLBACK_ALERTS;
  }
};

const severityStyles: Record<
  ServiceAlert["severity"],
  { badge: string; label: string; icon: React.ElementType }
> = {
  high: {
    badge: "bg-destructive/10 text-destructive border-destructive/30",
    label: "High Impact",
    icon: AlertTriangle,
  },
  medium: {
    badge: "bg-accent/10 text-accent border-accent/30",
    label: "Medium Impact",
    icon: Bell,
  },
  low: {
    badge: "bg-secondary/10 text-secondary border-secondary/30",
    label: "Heads-up",
    icon: ShieldCheck,
  },
};

export const ServiceAlerts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["service-alerts"],
    queryFn: fetchServiceAlerts,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section id="alerts" className="py-16 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-xs uppercase tracking-wide">
            Live Network Alerts
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Stay ahead of operational changes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We ingest real-time advisories from the Public Transport command center.
            Passengers receive proactive guidance on disruptions across all modes.
          </p>
        </div>

        {error ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="py-8 text-center text-destructive">
              Unable to load alerts. Confirm that Supabase policies allow read access.
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full md:w-1/2 lg:w-1/3 grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="high">High</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
            </TabsList>
            {["all", "high", "medium"].map((tab) => (
              <TabsContent key={tab} value={tab}>
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
                    : (data || [])
                      .filter((alert) => tab === "all" || alert.severity === tab)
                      .map((alert) => {
                        const severity = severityStyles[alert.severity];
                        const Icon = severity.icon;
                        return (
                          <Card
                            key={alert.id}
                            className="border border-border/60 shadow-[var(--shadow-elegant)]"
                          >
                            <CardHeader className="space-y-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">{alert.title}</CardTitle>
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-full border ${severity.badge}`}
                                >
                                  {severity.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icon className="w-4 h-4" />
                                <span>
                                  Effective{" "}
                                  {new Date(alert.valid_from).toLocaleString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    weekday: "short",
                                  })}
                                  {alert.valid_to
                                    ? ` • until ${new Date(alert.valid_to).toLocaleString("en-IN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      weekday: "short",
                                    })}`
                                    : " • until further notice"}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {alert.description}
                              </p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                {alert.affected_modes.map((mode) => (
                                  <Badge key={mode} variant="secondary">
                                    {mode.replace("_", " ")}
                                  </Badge>
                                ))}
                                {(alert.affected_locations || []).map((location) => (
                                  <Badge key={location} variant="outline">
                                    {location}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  {!isLoading && data && data.length === 0 && (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Network is running smoothly. No alerts published.
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};

