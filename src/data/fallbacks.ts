import type { ServiceAlert, TripMetrics } from "@/types/index";

const now = new Date();

export const FALLBACK_ALERTS: ServiceAlert[] = [
  {
    id: "fallback-1",
    title: "AI Weather Watch: Coastal Express",
    description:
      "Adaptive routing in effect between Bagya Nagar and Sriharipuram due to gusty coastal winds. Expect +12 mins on early-morning trains.",
    severity: "high",
    affected_modes: ["train"],
    affected_locations: ["Bagya Nagar Junction", "Sriharipuram Central"],
    valid_from: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
    valid_to: new Date(now.getTime() + 1000 * 60 * 60 * 6).toISOString(),
    created_at: now.toISOString(),
  },
  {
    id: "fallback-2",
    title: "Metro Pulse Maintenance",
    description:
      "Precision track calibration happening nightly near Rajendra Vanam. AI shuttles keep last-mile coverage intact.",
    severity: "medium",
    affected_modes: ["metro", "bus"],
    affected_locations: ["Rajendra Vanam Tech Park", "City Loop"],
    valid_from: now.toISOString(),
    valid_to: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
    created_at: now.toISOString(),
  },
  {
    id: "fallback-3",
    title: "Riverlink Ferries Rebalanced",
    description:
      "Smart-capacity scheduling has restored Someshwaram ↔ Vimalapuram ferries with 15-minute headways.",
    severity: "low",
    affected_modes: ["water"],
    affected_locations: ["Someshwaram Jetty", "Vimalapuram Pier"],
    valid_from: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    valid_to: new Date(now.getTime() + 1000 * 60 * 60 * 48).toISOString(),
    created_at: now.toISOString(),
  },
];

export const FALLBACK_METRICS: TripMetrics = {
  totalTrips: 284,
  avgCost: 1240,
  avgDuration: 215,
  originCoverage: 42,
  destinationCoverage: 47,
  emergencyTrips: 18,
  lastTripAt: now.toISOString(),
  occasionBreakdown: [
    { occasion: "business", tripCount: 112 },
    { occasion: "leisure", tripCount: 68 },
    { occasion: "wedding", tripCount: 42 },
    { occasion: "emergency", tripCount: 18 },
  ],
  topOrigin: "Bagya Nagar",
  topDestination: "Sriharipuram",
};


