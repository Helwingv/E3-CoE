import { useState, useEffect, useCallback } from "react";
import { type EventItem } from "../../../lib/supabase";
import { useAdminSupabase } from "./supabaseContext";
import EventForm from "./EventForm";

type View = "list" | "create" | "edit";

export default function EventsManager() {
  const supabase = useAdminSupabase();
  const [view, setView] = useState<View>("list");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events_items")
      .select("*")
      .order("event_date", { ascending: false });
    setEvents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleEdit = (event: EventItem) => {
    setSelected(event);
    setView("edit");
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events_items").delete().eq("id", id);
    setDeleteId(null);
    loadEvents();
  };

  const handleSaved = () => {
    setView("list");
    setSelected(null);
    loadEvents();
  };

  const handleCancel = () => {
    setView("list");
    setSelected(null);
  };

  if (view === "create" || view === "edit") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <button onClick={handleCancel} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-white">{view === "create" ? "New Event" : "Edit Event"}</h2>
            <p className="text-slate-500 text-sm">{view === "create" ? "Create a new event" : `Editing: ${selected?.title}`}</p>
          </div>
        </div>
        <EventForm event={selected} onSaved={handleSaved} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-white">Events</h2>
          <p className="text-slate-500 text-sm">{events.length} total &nbsp;·&nbsp; {events.filter(e => e.is_published).length} published</p>
        </div>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-2 bg-[#24a4b9] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1d8a9d] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Event
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#24a4b9] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
          <div className="text-slate-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium mb-1">No events yet</p>
          <p className="text-slate-600 text-sm">Create your first event to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map(event => {
            const isPast = new Date(event.event_date) < new Date();
            return (
              <div
                key={event.id}
                className="group flex items-center gap-4 bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-xl px-5 py-4 transition-all duration-150"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${event.is_published ? (isPast ? "bg-slate-500" : "bg-emerald-400") : "bg-slate-600"}`} />
                    <h3 className="text-white font-medium text-sm truncate">{event.title}</h3>
                  </div>
                  <div className="flex items-center gap-3 ml-4 flex-wrap">
                    <span className="text-slate-500 text-xs font-mono">/events/{event.slug}</span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-500 text-xs">{new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    {event.venue && <><span className="text-slate-700">·</span><span className="text-slate-500 text-xs">{event.venue}</span></>}
                    {event.location && <><span className="text-slate-700">·</span><span className="text-slate-500 text-xs">{event.location}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isPast && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700 text-slate-500">Past</span>}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${event.is_published ? "bg-emerald-400/10 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                    {event.is_published ? "Published" : "Draft"}
                  </span>
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  {deleteId === event.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(event.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
