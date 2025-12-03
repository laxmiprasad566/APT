import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { APTRailway } from "@/components/APTRailway";
import { TripResults } from "@/components/TripResults";
import type { PlannedRoute } from "@/components/TripResults";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { ServiceAlerts } from "@/components/ServiceAlerts";
import { RecentTrips } from "@/components/RecentTrips";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/api/client";
import type { OccasionType } from "@/types/index";

interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  occasion?: OccasionType;
}

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [routes, setRoutes] = useState<PlannedRoute[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const { toast } = useToast();

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    if (params.origin === params.destination) {
      toast({
        title: "Select different locations",
        description: "Origin and destination must be different to plan a trip.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Planning your trip...",
      description: "Finding the best routes for you",
    });

    try {
      // Get location IDs - handled by backend now, but we need to pass IDs or names?
      // The backend expects IDs. So we need to fetch locations first or let backend handle names?
      // The current frontend has names. Let's fetch locations here to get IDs.

      const locations = await api.getLocations();
      const originLoc = locations.find((l: any) => l.name === params.origin);
      const destLoc = locations.find((l: any) => l.name === params.destination);

      if (!originLoc || !destLoc) {
        toast({
          title: "Error",
          description: "Could not find selected locations",
          variant: "destructive",
        });
        return;
      }

      // Call API to calculate routes
      const data = await api.calculateRoutes({
        originId: originLoc.id,
        destinationId: destLoc.id,
        travelDate: params.date,
        occasion: params.occasion,
      });

      // Save trip plan
      const plannedRoutes = data?.routes ?? [];

      await api.createTripPlan({
        origin_id: originLoc.id,
        destination_id: destLoc.id,
        travel_date: params.date,
        occasion: params.occasion ?? null,
        total_cost: plannedRoutes[0]?.totalCost,
        total_duration: plannedRoutes[0]?.totalDuration,
        route_details: plannedRoutes,
        origin_name: params.origin,
        destination_name: params.destination,
      });

      setRoutes(plannedRoutes);
      setShowResults(true);

      toast({
        title: "Routes found!",
        description: `Found ${plannedRoutes.length} route options for your journey`,
      });
    } catch (error: unknown) {
      console.error("Error planning trip:", error);
      const message = error instanceof Error ? error.message : "Failed to plan trip. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleModifySearch = () => {
    setShowResults(false);
    setRoutes([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {!showResults ? (
          <>
            <Hero onSearch={handleSearch} />
            <ImpactMetrics />
            <ServiceAlerts />
            <RecentTrips />
            <APTRailway />
            <Features />
          </>
        ) : (
          <>
            <TripResults
              routes={routes}
              searchParams={searchParams!}
              onModify={handleModifySearch}
            />
            <ImpactMetrics />
            <ServiceAlerts />
            <RecentTrips />
            <APTRailway />
            <Features />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
