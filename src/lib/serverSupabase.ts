import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase settings can arrive two ways on Netlify: baked in at build time
// (import.meta.env) or read when a page runs (process.env). Check both, and a
// few common names, so a page never crashes when one of them is missing.
function read(name: string): string | undefined {
  const fromBuild = (import.meta.env as Record<string, string | undefined>)[name];
  const fromRuntime =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  return fromBuild || fromRuntime || undefined;
}

export function supabaseConfig() {
  const url =
    read("VITE_SUPABASE_URL") || read("PUBLIC_SUPABASE_URL") || read("SUPABASE_URL");
  const key =
    read("VITE_SUPABASE_ANON_KEY") ||
    read("PUBLIC_SUPABASE_ANON_KEY") ||
    read("SUPABASE_ANON_KEY");
  return { url, key };
}

let client: SupabaseClient | null | undefined;

/** Returns a Supabase client, or null when the settings are missing. */
export function getServerSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const { url, key } = supabaseConfig();
  if (!url || !key) {
    console.error(
      "[E3 CoE] Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify."
    );
    client = null;
  } else {
    client = createClient(url, key);
  }
  return client;
}
