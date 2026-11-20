import { useState, useEffect, useCallback } from "react";
import { useAdminSupabase } from "./supabaseContext";

interface Registration {
  id: string;
  event_id: string;
  event_title: string;
  event_slug: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  notes: string;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-400/10 text-amber-500",
  confirmed: "bg-emerald-400/10 text-emerald-400",
  cancelled: "bg-slate-700 text-slate-400",
};

export default function RegistrationsManager() {
  const supabase = useAdminSupabase();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: regs }, { data: evts }] = await Promise.all([
      supabase
        .from("event_registrations")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("events_items")
        .select("id,title")
        .eq("is_published", true)
        .order("event_date", { ascending: false }),
    ]);
    setRegistrations(regs ?? []);
    setEvents(evts ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase
      .from("event_registrations")
      .update({ status: newStatus })
      .eq("id", id);
    setRegistrations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filtered =
    eventFilter === "all"
      ? registrations
      : registrations.filter(r => r.event_id === eventFilter);

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-white">Event Registrations</h2>
          <p className="text-slate-500 text-sm">
            {filtered.length} registration{filtered.length !== 1 ? "s" : ""}
            {eventFilter !== "all" && " for this event"}
          </p>
        </div>
        <select
          value={eventFilter}
          onChange={e => setEventFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#24a4b9]"
        >
          <option value="all">All Events</option>
          {events.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#24a4b9] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
          <div className="text-slate-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium mb-1">No registrations yet</p>
          <p className="text-slate-600 text-sm">Registrations submitted via event pages will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(reg => (
            <div
              key={reg.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === reg.id ? null : reg.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-medium text-sm truncate">{reg.name}</p>
                    {reg.organization && (
                      <span className="text-slate-500 text-xs">· {reg.organization}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">{reg.email}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-500 text-xs truncate">{reg.event_title}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-500 text-xs">
                      {new Date(reg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[reg.status] ?? "bg-slate-700 text-slate-400"}`}>
                    {reg.status}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform ${expanded === reg.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expanded === reg.id && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-700/50">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Contact</p>
                      <p className="text-slate-300">{reg.email}</p>
                      {reg.phone && <p className="text-slate-400">{reg.phone}</p>}
                    </div>
                    {reg.organization && (
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Organization</p>
                        <p className="text-slate-300">{reg.organization}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Event</p>
                      <a
                        href={`/events/${reg.event_slug}`}
                        target="_blank"
                        rel="noopener"
                        className="text-[#24a4b9] hover:underline text-sm"
                      >
                        {reg.event_title}
                      </a>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Registered</p>
                      <p className="text-slate-300">
                        {new Date(reg.created_at).toLocaleString("en-US", {
                          month: "long", day: "numeric", year: "numeric",
                          hour: "numeric", minute: "2-digit"
                        })}
                      </p>
                    </div>
                    {reg.notes && (
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Notes</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{reg.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs mr-1">Status:</span>
                    {["pending", "confirmed", "cancelled"].map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(reg.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                          reg.status === s
                            ? s === "confirmed"
                              ? "bg-emerald-500 text-white"
                              : s === "cancelled"
                                ? "bg-slate-600 text-white"
                                : "bg-amber-500 text-white"
                            : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
