-- Extend trip planning backend with alerts, metrics, and richer seed data

-- Create severity enum for alerts
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high');

-- Add human-readable snapshots for trip plans
ALTER TABLE public.trip_plans
  ADD COLUMN origin_name TEXT,
  ADD COLUMN destination_name TEXT;

-- Create service alerts table to surface operational disruptions
CREATE TABLE public.service_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity alert_severity NOT NULL,
  affected_modes transport_mode[] DEFAULT '{}'::transport_mode[],
  affected_locations TEXT[] DEFAULT '{}'::text[],
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.service_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service alerts are viewable by everyone"
  ON public.service_alerts
  FOR SELECT
  USING (true);

-- Seed key intercity routes so the planner has baseline data
WITH origin AS (SELECT id FROM public.locations WHERE name = 'Bagya Nagar'),
     destination AS (SELECT id FROM public.locations WHERE name = 'Sriharipuram')
INSERT INTO public.routes (origin_id, destination_id, transport_mode, distance_km, duration_minutes, base_cost, frequency_per_day)
SELECT origin.id, destination.id, 'train', 540, 320, 980, 7
FROM origin CROSS JOIN destination
ON CONFLICT (origin_id, destination_id, transport_mode) DO NOTHING;

WITH origin AS (SELECT id FROM public.locations WHERE name = 'Bagya Nagar'),
     destination AS (SELECT id FROM public.locations WHERE name = 'Rajendra Vanam')
INSERT INTO public.routes (origin_id, destination_id, transport_mode, distance_km, duration_minutes, base_cost, frequency_per_day)
SELECT origin.id, destination.id, 'bus', 420, 360, 540, 10
FROM origin CROSS JOIN destination
ON CONFLICT (origin_id, destination_id, transport_mode) DO NOTHING;

WITH origin AS (SELECT id FROM public.locations WHERE name = 'Sriharipuram'),
     destination AS (SELECT id FROM public.locations WHERE name = 'Kaveripattinam')
INSERT INTO public.routes (origin_id, destination_id, transport_mode, distance_km, duration_minutes, base_cost, frequency_per_day)
SELECT origin.id, destination.id, 'air', 760, 120, 4200, 4
FROM origin CROSS JOIN destination
ON CONFLICT (origin_id, destination_id, transport_mode) DO NOTHING;

WITH origin AS (SELECT id FROM public.locations WHERE name = 'Rajendra Vanam'),
     destination AS (SELECT id FROM public.locations WHERE name = 'Kaveripattinam')
INSERT INTO public.routes (origin_id, destination_id, transport_mode, distance_km, duration_minutes, base_cost, frequency_per_day)
SELECT origin.id, destination.id, 'metro', 48, 55, 120, 24
FROM origin CROSS JOIN destination
ON CONFLICT (origin_id, destination_id, transport_mode) DO NOTHING;

WITH origin AS (SELECT id FROM public.locations WHERE name = 'Chandrapuri'),
     destination AS (SELECT id FROM public.locations WHERE name = 'Harinagar')
INSERT INTO public.routes (origin_id, destination_id, transport_mode, distance_km, duration_minutes, base_cost, frequency_per_day)
SELECT origin.id, destination.id, 'bus', 210, 180, 320, 14
FROM origin CROSS JOIN destination
ON CONFLICT (origin_id, destination_id, transport_mode) DO NOTHING;

-- Sample operational alerts
INSERT INTO public.service_alerts (title, description, severity, affected_modes, affected_locations, valid_from, valid_to)
VALUES
  (
    'Monsoon Impact on Coastal Rail',
    'Heavy rains between Bagya Nagar and Sriharipuram may delay morning express services by up to 25 minutes.',
    'high',
    ARRAY['train']::transport_mode[],
    ARRAY['Bagya Nagar Junction', 'Sriharipuram Central'],
    now() - INTERVAL '2 hours',
    now() + INTERVAL '18 hours'
  ),
  (
    'Scheduled Metro Maintenance',
    'Track maintenance near Rajendra Vanam metro corridor from 10 PM to 4 AM. Use shuttle buses for late travel.',
    'medium',
    ARRAY['metro', 'bus']::transport_mode[],
    ARRAY['Rajendra Vanam', 'Downtown Connector'],
    now(),
    now() + INTERVAL '2 days'
  ),
  (
    'Ferry Services Resumed',
    'Water transport between Someshwaram and Vimalapuram is operational with limited capacity. Expect 15 minute headways.',
    'low',
    ARRAY['water']::transport_mode[],
    ARRAY['Someshwaram Jetty', 'Vimalapuram Pier'],
    now() - INTERVAL '6 hours',
    now() + INTERVAL '3 days'
  );

-- Provide representative trip history for dashboards
WITH origin AS (SELECT id, name FROM public.locations WHERE name = 'Bagya Nagar'),
     destination AS (SELECT id, name FROM public.locations WHERE name = 'Sriharipuram')
INSERT INTO public.trip_plans (origin_id, destination_id, travel_date, occasion, total_cost, total_duration, route_details, origin_name, destination_name)
SELECT origin.id, destination.id, (CURRENT_DATE + INTERVAL '3 days')::date, 'business', 980, 320,
       jsonb_build_array(
         jsonb_build_object(
           'mode', 'train',
           'from', origin.name,
           'to', destination.name,
           'duration', 320,
           'cost', 980,
           'departure', '07:10 AM',
           'arrival', '12:30 PM'
         )
       ),
       origin.name,
       destination.name
FROM origin CROSS JOIN destination
ON CONFLICT DO NOTHING;

WITH origin AS (SELECT id, name FROM public.locations WHERE name = 'Chandrapuri'),
     destination AS (SELECT id, name FROM public.locations WHERE name = 'Harinagar')
INSERT INTO public.trip_plans (origin_id, destination_id, travel_date, occasion, total_cost, total_duration, route_details, origin_name, destination_name)
SELECT origin.id, destination.id, (CURRENT_DATE + INTERVAL '10 days')::date, 'wedding', 640, 240,
       jsonb_build_array(
         jsonb_build_object(
           'mode', 'bus',
           'from', origin.name,
           'to', destination.name,
           'duration', 180,
           'cost', 320,
           'departure', '06:00 AM',
           'arrival', '09:00 AM'
         ),
         jsonb_build_object(
           'mode', 'shared_taxi',
           'from', destination.name,
           'to', 'Harinagar Enclave',
           'duration', 60,
           'cost', 120,
           'departure', '09:15 AM',
           'arrival', '10:15 AM'
         )
       ),
       origin.name,
       destination.name
FROM origin CROSS JOIN destination
ON CONFLICT DO NOTHING;

WITH origin AS (SELECT id, name FROM public.locations WHERE name = 'Rajendra Vanam'),
     destination AS (SELECT id, name FROM public.locations WHERE name = 'Kaveripattinam')
INSERT INTO public.trip_plans (origin_id, destination_id, travel_date, occasion, total_cost, total_duration, route_details, origin_name, destination_name)
SELECT origin.id, destination.id, (CURRENT_DATE + INTERVAL '1 day')::date, 'emergency', 560, 115,
       jsonb_build_array(
         jsonb_build_object(
           'mode', 'metro',
           'from', origin.name,
           'to', 'Kaveripattinam Terminal',
           'duration', 55,
           'cost', 120,
           'departure', '05:30 AM',
           'arrival', '06:25 AM'
         ),
         jsonb_build_object(
           'mode', 'air',
           'from', 'Kaveripattinam Terminal',
           'to', destination.name,
           'duration', 60,
           'cost', 440,
           'departure', '07:00 AM',
           'arrival', '08:00 AM'
         )
       ),
       origin.name,
       destination.name
FROM origin CROSS JOIN destination
ON CONFLICT DO NOTHING;

-- Aggregated metrics function for dashboards
CREATE OR REPLACE FUNCTION public.get_trip_plan_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH stats AS (
    SELECT
      COUNT(*)::bigint AS total_trips,
      AVG(total_cost)::numeric AS avg_cost,
      AVG(total_duration)::numeric AS avg_duration,
      COUNT(DISTINCT origin_id)::bigint AS origin_count,
      COUNT(DISTINCT destination_id)::bigint AS destination_count,
      MAX(created_at) AS last_trip
    FROM public.trip_plans
  ),
  emergency AS (
    SELECT COUNT(*)::bigint AS emergency_trips
    FROM public.trip_plans
    WHERE occasion = 'emergency'
  ),
  breakdown AS (
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'occasion', occasion,
          'tripCount', trip_count
        )
        ORDER BY trip_count DESC
      ),
      '[]'::jsonb
    ) AS breakdown_data
    FROM (
      SELECT occasion, COUNT(*) AS trip_count
      FROM public.trip_plans
      WHERE occasion IS NOT NULL
      GROUP BY occasion
    ) AS sub
  ),
  top_origin AS (
    SELECT origin_name, COUNT(*) AS trip_count
    FROM public.trip_plans
    WHERE origin_name IS NOT NULL
    GROUP BY origin_name
    ORDER BY trip_count DESC
    LIMIT 1
  ),
  top_destination AS (
    SELECT destination_name, COUNT(*) AS trip_count
    FROM public.trip_plans
    WHERE destination_name IS NOT NULL
    GROUP BY destination_name
    ORDER BY trip_count DESC
    LIMIT 1
  )
  SELECT jsonb_build_object(
      'totalTrips', COALESCE(stats.total_trips, 0),
      'avgCost', COALESCE(stats.avg_cost, 0),
      'avgDuration', COALESCE(stats.avg_duration, 0),
      'originCoverage', COALESCE(stats.origin_count, 0),
      'destinationCoverage', COALESCE(stats.destination_count, 0),
      'emergencyTrips', COALESCE(emergency.emergency_trips, 0),
      'lastTripAt', stats.last_trip,
      'occasionBreakdown', breakdown.breakdown_data,
      'topOrigin', (SELECT origin_name FROM top_origin),
      'topDestination', (SELECT destination_name FROM top_destination)
    )
  INTO result
  FROM stats
  CROSS JOIN emergency
  CROSS JOIN breakdown;

  RETURN COALESCE(
    result,
    jsonb_build_object(
      'totalTrips', 0,
      'avgCost', 0,
      'avgDuration', 0,
      'originCoverage', 0,
      'destinationCoverage', 0,
      'emergencyTrips', 0,
      'lastTripAt', NULL,
      'occasionBreakdown', '[]'::jsonb,
      'topOrigin', NULL,
      'topDestination', NULL
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_trip_plan_metrics() TO anon;
GRANT EXECUTE ON FUNCTION public.get_trip_plan_metrics() TO authenticated;

