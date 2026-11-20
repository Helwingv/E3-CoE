// E3 CoE shares Vision 8:28's Supabase project but keeps its own content in
// separate e3_* tables, so posts on one site never appear on the other.
export const TABLES = {
  news: "e3_news_articles",
  events: "e3_events_items",
  registrations: "e3_event_registrations"
} as const;
