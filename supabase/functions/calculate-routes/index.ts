import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const EMISSION_FACTORS: Record<string, number> = {
  train: 2.5,
  metro: 1.8,
  bus: 3.8,
  air: 9.5,
  water: 4.1,
  shared_taxi: 4.6,
};

const OCCASION_PRIORITIES: Record<string, { speed: number; comfort: number; cost: number }> = {
  emergency: { speed: 1.4, comfort: 0.8, cost: 0.6 },
  medical: { speed: 1.3, comfort: 0.9, cost: 0.7 },
  business: { speed: 1.1, comfort: 1.2, cost: 0.9 },
  exam: { speed: 1.2, comfort: 1.0, cost: 0.85 },
  wedding: { speed: 1.0, comfort: 1.1, cost: 0.9 },
  leisure: { speed: 0.9, comfort: 1.2, cost: 1.1 },
  default: { speed: 1, comfort: 1, cost: 1 },
};

interface RouteSegment {
  mode: string;
  from: string;
  to: string;
  duration: number;
  cost: number;
  departure: string;
  arrival: string;
}

interface Route {
  id: string;
  type: string;
  segments: RouteSegment[];
  totalDuration: number;
  totalCost: number;
  score?: number;
  carbonEstimate?: number;
  insight?: string;
}



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    // Preflight response
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { originId, destinationId, travelDate, occasion } = await req.json();

    console.log('Calculating routes:', { originId, destinationId, travelDate, occasion });

    // Get origin and destination details
    const { data: origin } = await supabaseClient
      .from('locations')
      .select('*')
      .eq('id', originId)
      .single();

    const { data: destination } = await supabaseClient
      .from('locations')
      .select('*')
      .eq('id', destinationId)
      .single();

    if (!origin || !destination) {
      throw new Error('Invalid origin or destination');
    }

    const [
      directRoutesResponse,
      forwardConnectionsResponse,
      inboundConnectionsResponse,
    ] = await Promise.all([
      supabaseClient
        .from('routes')
        .select('*')
        .eq('origin_id', originId)
        .eq('destination_id', destinationId),
      supabaseClient.from('routes').select('*').eq('origin_id', originId),
      supabaseClient.from('routes').select('*').eq('destination_id', destinationId),
    ]);

    if (directRoutesResponse.error) throw directRoutesResponse.error;
    if (forwardConnectionsResponse.error) throw forwardConnectionsResponse.error;
    if (inboundConnectionsResponse.error) throw inboundConnectionsResponse.error;

    const directRoutes = directRoutesResponse.data;
    const forwardConnections = forwardConnectionsResponse.data;
    const inboundConnections = inboundConnectionsResponse.data;

    console.log('Direct routes found:', directRoutes?.length || 0);

    const routes: Route[] = [];
    const connectorIds = new Set<string>();
    forwardConnections?.forEach(route => connectorIds.add(route.destination_id));
    inboundConnections?.forEach(route => connectorIds.add(route.origin_id));
    connectorIds.delete(originId);
    connectorIds.delete(destinationId);

    let locationMap = new Map<string, string>();
    if (connectorIds.size > 0) {
      const { data: connectorLocations, error: connectorError } = await supabaseClient
        .from('locations')
        .select('id, name')
        .in('id', Array.from(connectorIds));

      if (connectorError) {
        throw connectorError;
      }

      if (connectorLocations) {
        locationMap = new Map(connectorLocations.map((loc) => [loc.id, loc.name]));
      }
    }

    // Generate standard routes
    if (directRoutes && directRoutes.length > 0) {
      // Direct routes
      directRoutes.forEach((route) => {
        const baseTime = new Date(`${travelDate}T08:00:00`);
        const durationMinutes = route.duration_minutes ?? 0;
        const arrivalTime = new Date(baseTime.getTime() + durationMinutes * 60000);
        
        routes.push({
          id: crypto.randomUUID(),
          type: 'standard',
          segments: [{
            mode: route.transport_mode,
            from: origin.name,
            to: destination.name,
            duration: durationMinutes,
            cost: route.base_cost ?? 0,
            departure: formatTime(baseTime),
            arrival: formatTime(arrivalTime),
          }],
          totalDuration: durationMinutes,
          totalCost: route.base_cost ?? 0,
        });
      });
    } else {
      // Generate sample multi-modal routes when no direct routes exist
      const sampleRoutes = generateSampleRoutes(origin.name, destination.name, travelDate, occasion);
      routes.push(...sampleRoutes);
    }

    if (forwardConnections && inboundConnections) {
      let combosAdded = 0;
      const layoverMinutes = 30;
      forwardConnections.forEach((firstLeg) => {
        if (!firstLeg.destination_id) return;
        const matchingSecondLegs = inboundConnections.filter(
          (secondLeg) => secondLeg.origin_id === firstLeg.destination_id,
        );

        matchingSecondLegs.slice(0, 2).forEach((secondLeg) => {
          if (combosAdded >= 3) return;
          combosAdded++;

          const interchangeName = locationMap.get(firstLeg.destination_id) || 'Interchange Hub';
          const baseTime = new Date(`${travelDate}T06:30:00`);
          const firstDuration = firstLeg.duration_minutes ?? 0;
          const secondDuration = secondLeg.duration_minutes ?? 0;
          const firstArrival = new Date(baseTime.getTime() + firstDuration * 60000);
          const secondDeparture = new Date(firstArrival.getTime() + layoverMinutes * 60000);
          const secondArrival = new Date(secondDeparture.getTime() + secondDuration * 60000);

          routes.push({
            id: crypto.randomUUID(),
            type: 'standard',
            segments: [
              {
                mode: firstLeg.transport_mode,
                from: origin.name,
                to: interchangeName,
                duration: firstDuration,
                cost: firstLeg.base_cost ?? 0,
                departure: formatTime(baseTime),
                arrival: formatTime(firstArrival),
              },
              {
                mode: secondLeg.transport_mode,
                from: interchangeName,
                to: destination.name,
                duration: secondDuration,
                cost: secondLeg.base_cost ?? 0,
                departure: formatTime(secondDeparture),
                arrival: formatTime(secondArrival),
              },
            ],
            totalDuration: firstDuration + secondDuration + layoverMinutes,
            totalCost: (firstLeg.base_cost ?? 0) + (secondLeg.base_cost ?? 0),
          });
        });
      });
    }

    // Generate luxury variant
    routes.push({
      id: crypto.randomUUID(),
      type: 'luxury',
      segments: [{
        mode: 'air',
        from: origin.name,
        to: destination.name,
        duration: 120,
        cost: 5000,
        departure: '09:00 AM',
        arrival: '11:00 AM',
      }],
      totalDuration: 120,
      totalCost: 5000,
    });

    // Generate speed variant
    routes.push({
      id: crypto.randomUUID(),
      type: 'speed',
      segments: [{
        mode: 'train',
        from: origin.name,
        to: destination.name,
        duration: 180,
        cost: 1500,
        departure: '06:00 AM',
        arrival: '09:00 AM',
      }],
      totalDuration: 180,
      totalCost: 1500,
    });

    const enrichedRoutes = enrichRoutes(routes, occasion);
    console.log('Total routes generated:', enrichedRoutes.length);

    return new Response(
      JSON.stringify({ routes: enrichedRoutes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error calculating routes:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

function generateSampleRoutes(origin: string, destination: string, travelDate: string, occasion?: string): Route[] {
  const routes: Route[] = [];

  // Multi-modal route 1: Bus + Train
  routes.push({
    id: crypto.randomUUID(),
    type: 'standard',
    segments: [
      {
        mode: 'bus',
        from: origin,
        to: 'Bagya Nagar',
        duration: 90,
        cost: 300,
        departure: '07:00 AM',
        arrival: '08:30 AM',
      },
      {
        mode: 'train',
        from: 'Bagya Nagar',
        to: destination,
        duration: 180,
        cost: 800,
        departure: '09:30 AM',
        arrival: '12:30 PM',
      },
    ],
    totalDuration: 330,
    totalCost: 1100,
  });

  // Multi-modal route 2: Shared Taxi + Metro + Bus
  routes.push({
    id: crypto.randomUUID(),
    type: 'standard',
    segments: [
      {
        mode: 'shared_taxi',
        from: origin,
        to: 'Sriharipuram',
        duration: 60,
        cost: 250,
        departure: '08:00 AM',
        arrival: '09:00 AM',
      },
      {
        mode: 'metro',
        from: 'Sriharipuram',
        to: 'Rajendra Vanam',
        duration: 45,
        cost: 50,
        departure: '09:30 AM',
        arrival: '10:15 AM',
      },
      {
        mode: 'bus',
        from: 'Rajendra Vanam',
        to: destination,
        duration: 120,
        cost: 400,
        departure: '11:00 AM',
        arrival: '01:00 PM',
      },
    ],
    totalDuration: 300,
    totalCost: 700,
  });

  return routes;
}

function enrichRoutes(routes: Route[], occasion?: string): Route[] {
  return routes.map((route) => {
    const carbonEstimate = route.segments.reduce((total, segment) => total + estimateCarbon(segment), 0);
    return {
      ...route,
      carbonEstimate: Number(carbonEstimate.toFixed(1)),
      score: calculateRouteScore(route, occasion),
      insight: buildInsight(route, occasion, carbonEstimate),
    };
  });
}

function estimateCarbon(segment: RouteSegment) {
  const factor = EMISSION_FACTORS[segment.mode] ?? 3.5;
  return ((segment.duration || 0) / 60) * factor;
}

function calculateRouteScore(route: Route, occasion?: string) {
  const weights =
    OCCASION_PRIORITIES[occasion as keyof typeof OCCASION_PRIORITIES] ?? OCCASION_PRIORITIES.default;
  const durationHours = Math.max(route.totalDuration, 60) / 60;
  const costFactor = Math.max(route.totalCost, 200);
  const speedComponent = (weights.speed * 200) / durationHours;
  const costComponent = (weights.cost * 1500) / costFactor;
  const comfortComponent = weights.comfort * (route.segments.length === 1 ? 25 : 15);
  const transfersPenalty = Math.max(0, (route.segments.length - 1) * 5);
  const rawScore = 30 + speedComponent + costComponent + comfortComponent - transfersPenalty;
  return Math.round(Math.max(45, Math.min(99, rawScore)));
}

function buildInsight(route: Route, occasion?: string, carbonEstimate?: number) {
  if (occasion === 'emergency' || occasion === 'medical') {
    return 'Prioritized for urgent arrival with fastest corridors';
  }

  if (occasion === 'business') {
    return 'Keeps you punctual with minimal transfers and buffer time';
  }

  if (route.type === 'luxury') {
    return 'Premium cabin with assisted boarding and lounge access';
  }

  if (route.type === 'speed') {
    return 'Earliest arrival using the fastest available segments';
  }

  if ((carbonEstimate ?? 0) < 20) {
    return 'Low-emission journey using electrified and shared modes';
  }

  if (route.segments.length > 1) {
    return 'Optimized multimodal blend balancing cost and comfort';
  }

  return 'Balanced itinerary tuned for everyday travelers';
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
