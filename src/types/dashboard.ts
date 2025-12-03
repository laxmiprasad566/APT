export interface ServiceAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  affected_modes: string[];
  affected_locations: string[] | null;
  valid_from: string;
  valid_to: string | null;
}

export interface TripMetrics {
  totalTrips: number;
  avgCost: number;
  avgDuration: number;
  originCoverage: number;
  destinationCoverage: number;
  emergencyTrips: number;
  lastTripAt: string | null;
  occasionBreakdown: { occasion: string; tripCount: number }[] | null;
  topOrigin: string | null;
  topDestination: string | null;
}


