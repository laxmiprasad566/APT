export type OccasionType = 'exam' | 'business' | 'leisure' | 'emergency' | 'wedding' | 'medical';

export type TransportMode =
    | '1st_ac_train' | '2nd_ac_train' | '3rd_ac_train' | 'sleeper_train'
    | 'ac_bus' | 'non_ac_bus' | 'semi_sleeper_bus' | 'sleeper_bus'
    | 'economy_flight' | 'business_flight'
    | 'shared_taxi' | 'private_ac_taxi' | 'private_taxi'
    | 'metro' | 'auto_rickshaw';

export interface Location {
    id: string;
    name: string;
    location_type: string;
}

export interface ServiceAlert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    affected_modes: string[];
    affected_locations: string[];
    valid_from: string;
    valid_to: string | null;
    created_at: string;
}

export interface TripPlan {
    id: string;
    origin_name: string | null;
    destination_name: string | null;
    travel_date: string;
    occasion: string | null;
    total_cost: number | null;
    total_duration: number | null;
    created_at: string | null;
    route_details: any;
}

export interface TripMetrics {
    totalTrips: number;
    avgCost: number;
    avgDuration: number;
    originCoverage: number;
    destinationCoverage: number;
    emergencyTrips: number;
    lastTripAt: string | null;
    occasionBreakdown: { occasion: string; tripCount: number }[];
    topOrigin: string | null;
    topDestination: string | null;
}
