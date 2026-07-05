import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabase } from "../config/env";

export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;
