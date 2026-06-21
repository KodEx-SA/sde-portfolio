import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabase } from "../config/env";

/**
 * Supabase is OPTIONAL. If SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY aren't set,
 * this stays null and contact/analytics routes just skip persistence
 * (the contact form still emails you either way).
 *
 * To enable: create a free Supabase project, then create two tables:
 *
 *   create table contact_submissions (
 *     id uuid primary key default gen_random_uuid(),
 *     name text not null,
 *     email text not null,
 *     subject text not null,
 *     message text not null,
 *     created_at timestamptz not null default now()
 *   );
 *
 *   create table analytics_events (
 *     id uuid primary key default gen_random_uuid(),
 *     event text not null,
 *     path text,
 *     meta jsonb,
 *     created_at timestamptz not null default now()
 *   );
 *
 * Then set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (Project Settings → API)
 * as env vars on your backend host.
 */
export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;
