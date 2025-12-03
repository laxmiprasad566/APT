-- Create enum for location types
CREATE TYPE location_type AS ENUM ('mega_city', 'city', 'town', 'village');

-- Create enum for transport modes
CREATE TYPE transport_mode AS ENUM ('train', 'bus', 'metro', 'air', 'water', 'shared_taxi');

-- Create enum for occasion types
CREATE TYPE occasion_type AS ENUM ('exam', 'business', 'leisure', 'emergency', 'wedding', 'medical');

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location_type location_type NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_id UUID REFERENCES public.locations(id) NOT NULL,
  destination_id UUID REFERENCES public.locations(id) NOT NULL,
  transport_mode transport_mode NOT NULL,
  distance_km DECIMAL(10, 2),
  duration_minutes INTEGER,
  base_cost DECIMAL(10, 2),
  frequency_per_day INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(origin_id, destination_id, transport_mode)
);

-- Create trip_plans table
CREATE TABLE public.trip_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  origin_id UUID REFERENCES public.locations(id) NOT NULL,
  destination_id UUID REFERENCES public.locations(id) NOT NULL,
  travel_date DATE NOT NULL,
  occasion occasion_type,
  total_cost DECIMAL(10, 2),
  total_duration INTEGER,
  route_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_plans ENABLE ROW LEVEL SECURITY;

-- Locations are public (everyone can view)
CREATE POLICY "Locations are viewable by everyone"
ON public.locations FOR SELECT
USING (true);

-- Routes are public (everyone can view)
CREATE POLICY "Routes are viewable by everyone"
ON public.routes FOR SELECT
USING (true);

-- Trip plans policies
CREATE POLICY "Anyone can create trip plans"
ON public.trip_plans FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view trip plans"
ON public.trip_plans FOR SELECT
USING (true);

-- Insert sample mega cities
INSERT INTO public.locations (name, location_type) VALUES
('Bagya Nagar', 'mega_city'),
('Sriharipuram', 'mega_city'),
('Rajendra Vanam', 'mega_city'),
('Kaveripattinam', 'mega_city'),
('Indrapura', 'mega_city');

-- Insert sample cities
INSERT INTO public.locations (name, location_type) VALUES
('Arunagiri', 'city'),
('Chandrapuri', 'city'),
('Someshwaram', 'city'),
('Vimalapuram', 'city'),
('Harinagar', 'city'),
('Jayapuri', 'city'),
('Kalyanpur', 'city'),
('Malleshwaram', 'city'),
('Ratnapuri', 'city'),
('Govindapur', 'city');

-- Insert sample towns
INSERT INTO public.locations (name, location_type) VALUES
('Lingapur', 'town'),
('Mantralaya', 'town'),
('Venkateshpur', 'town'),
('Amaravati', 'town'),
('Raghunathpur', 'town');

-- Insert sample villages
INSERT INTO public.locations (name, location_type) VALUES
('Rampalli', 'village'),
('Narsingi', 'village'),
('Kollur', 'village'),
('Pedda Gudem', 'village'),
('Chinna Kunta', 'village');

-- Create index for faster lookups
CREATE INDEX idx_routes_origin ON public.routes(origin_id);
CREATE INDEX idx_routes_destination ON public.routes(destination_id);
CREATE INDEX idx_trip_plans_user ON public.trip_plans(user_id);
CREATE INDEX idx_locations_type ON public.locations(location_type);