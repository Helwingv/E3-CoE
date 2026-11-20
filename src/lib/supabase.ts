import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, key?: string): SupabaseClient {
  if (!_client) {
    const supabaseUrl = url ?? (import.meta.env.VITE_SUPABASE_URL as string);
    const supabaseKey = key ?? (import.meta.env.VITE_SUPABASE_ANON_KEY as string);
    _client = createClient(supabaseUrl, supabaseKey);
  }
  return _client;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  event_date: string;
  end_date: string | null;
  venue: string;
  location: string;
  rsvp_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
