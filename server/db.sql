-- Enable extensions (safe on most local PostgreSQL installations)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table: resources
CREATE TABLE IF NOT EXISTS public.resources (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    disaster_id uuid,
    name text,
    location_name text,
    location geography(Point, 4326),
    type text,
    created_at timestamptz DEFAULT now()
);

-- Table: cache
CREATE TABLE IF NOT EXISTS public.cache (
    key text PRIMARY KEY,
    value jsonb,
    expires_at timestamptz
);

-- Table: disasters
CREATE TABLE IF NOT EXISTS public.disasters (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    title text,
    location_name text,
    location geography(Point, 4326),
    description text,
    tags text[],
    owner_id text,
    created_at timestamptz DEFAULT now(),
    audit_trail jsonb,
    PRIMARY KEY (id)
);

-- Table: reports
CREATE TABLE IF NOT EXISTS public.reports (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    disaster_id uuid,
    user_id text,
    content text,
    image_url text,
    verification_status text,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (id),
    CONSTRAINT reports_disaster_id_fkey FOREIGN KEY (disaster_id) REFERENCES public.disasters(id) ON DELETE CASCADE
);

-- Add missing foreign key to resources
ALTER TABLE IF EXISTS public.resources
    ADD CONSTRAINT IF NOT EXISTS resources_disaster_id_fkey FOREIGN KEY (disaster_id) REFERENCES public.disasters(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS disasters_location_idx ON public.disasters USING gist (location);
CREATE INDEX IF NOT EXISTS disasters_tags_idx ON public.disasters USING gin (tags);

-- View: disasters_with_latlon
CREATE OR REPLACE VIEW public.disasters_with_latlon AS
SELECT
    id,
    title,
    location_name,
    description,
    ST_Y(location::geometry) AS latitude,
    ST_X(location::geometry) AS longitude,
    tags
FROM public.disasters;

-- Function: get_nearby_resources
CREATE OR REPLACE FUNCTION public.get_nearby_resources(
    lat_input double precision,
    lon_input double precision,
    distance_m integer
) RETURNS SETOF public.resources
LANGUAGE sql
AS $$
    SELECT * FROM public.resources
    WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_Point(lon_input, lat_input), 4326),
        distance_m
    );
$$;
