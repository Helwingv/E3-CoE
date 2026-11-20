import { useState, useEffect } from "react";
import { getSupabaseClient, type EventItem } from "../../lib/supabase";
import { TABLES } from "../../lib/tables";

export default function EventsLatest() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");

  useEffect(() => {
    let query = getSupabaseClient()
      .from(TABLES.events)
      .select("id,title,slug,excerpt,event_date,end_date,venue,location,rsvp_url")
      .eq("is_published", true)
      .order("event_date", { ascending: true })
      .limit(9);

    if (filter === "upcoming") {
      query = query.gte("event_date", new Date().toISOString());
    }

    query.then(({ data }) => {
      setEvents(data ?? []);
      setLoading(false);
    });
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#5B9BD5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (events.length === 0 && filter === "upcoming") {
    return (
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl">
            <p className="text-slate-400 font-medium">No upcoming events scheduled. Check back soon.</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-3 text-[#5B9BD5] text-sm font-semibold hover:underline"
            >
              View past events →
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section id="events" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="text-[#5B9BD5] text-sm font-bold uppercase tracking-widest mb-3">Calendar</div>
            <h2 className="text-4xl font-bold text-slate-900">
              {filter === "upcoming" ? "Upcoming Events" : "All Events"}
            </h2>
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === "upcoming" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === "all" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}
            >
              All Events
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {events.map(event => {
            const isPast = new Date(event.event_date) < new Date();
            const eventDate = new Date(event.event_date);
            return (
              <a
                key={event.id}
                href={`/events/${event.slug}`}
                className="group flex items-stretch bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div className={`w-20 flex-shrink-0 flex flex-col items-center justify-center p-4 ${isPast ? "bg-slate-100" : "bg-slate-900"}`}>
                  <span className={`text-xs font-bold uppercase tracking-widest ${isPast ? "text-slate-400" : "text-[#5B9BD5]"}`}>
                    {eventDate.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className={`text-3xl font-black leading-none ${isPast ? "text-slate-400" : "text-white"}`}>
                    {eventDate.getDate()}
                  </span>
                  <span className={`text-xs font-medium ${isPast ? "text-slate-400" : "text-slate-400"}`}>
                    {eventDate.getFullYear()}
                  </span>
                </div>
                <div className="flex-1 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1 group-hover:text-[#5B9BD5] transition-colors">
                      {event.title}
                    </h3>
                    {event.excerpt && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{event.excerpt}</p>
                    )}
                    {(event.venue || event.location) && (
                      <div className="flex items-center gap-1 mt-2">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-slate-400 text-xs">{[event.venue, event.location].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {isPast ? (
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">Past</span>
                    ) : event.rsvp_url ? (
                      <span className="text-xs font-semibold text-[#5B9BD5] bg-[#5B9BD5]/10 px-3 py-1.5 rounded-full">RSVP Available</span>
                    ) : null}
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-[#5B9BD5] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
