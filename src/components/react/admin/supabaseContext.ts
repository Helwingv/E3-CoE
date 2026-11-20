import { createContext, useContext } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export const SupabaseContext = createContext<SupabaseClient | null>(null);

export function useAdminSupabase(): SupabaseClient {
  const client = useContext(SupabaseContext);
  if (!client) throw new Error("SupabaseContext not provided");
  return client;
}
