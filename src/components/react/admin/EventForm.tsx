import { useState, useEffect } from "react";
import { type EventItem } from "../../../lib/supabase";
import { useAdminSupabase } from "./supabaseContext";
import { TABLES } from "../../../lib/tables";

const generateSlug = (title: string) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const toDatetimeLocal = (iso: string | null | undefined) => {
  if (!iso) return "";
  return iso.slice(0, 16);
};

interface Props {
  event?: EventItem | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSaved, onCancel }: Props) {
  const supabase = useAdminSupabase();
  const isEdit = !!event;
  const [form, setForm] = useState({
    title: event?.title ?? "",
    slug: event?.slug ?? "",
    excerpt: event?.excerpt ?? "",
    content: event?.content ?? "",
    event_date: toDatetimeLocal(event?.event_date) || new Date().toISOString().slice(0, 16),
    end_date: toDatetimeLocal(event?.end_date),
    venue: event?.venue ?? "",
    location: event?.location ?? "",
    rsvp_url: event?.rsvp_url ?? "",
    is_published: event?.is_published ?? false,
  });
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slugEdited) {
      setForm(f => ({ ...f, slug: generateSlug(f.title) }));
    }
  }, [form.title, slugEdited]);

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      event_date: new Date(form.event_date).toISOString(),
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    let err;
    if (isEdit) {
      ({ error: err } = await supabase.from(TABLES.events).update(payload).eq("id", event!.id));
    } else {
      ({ error: err } = await supabase.from(TABLES.events).insert(payload));
    }

    if (err) {
      setError(err.message);
    } else {
      onSaved();
    }
    setSaving(false);
  };

  const inputCls = "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] focus:border-transparent text-sm transition-colors";
  const labelCls = "block text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelCls}>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => set("title", e.target.value)}
            className={inputCls}
            placeholder="Event name"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Slug *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">/events/</span>
            <input
              type="text"
              value={form.slug}
              onChange={e => { setSlugEdited(true); set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); }}
              className={`${inputCls} pl-16`}
              placeholder="event-slug"
              required
            />
          </div>
        </div>

        <div />

        <div>
          <label className={labelCls}>Event Date & Time *</label>
          <input type="datetime-local" value={form.event_date} onChange={e => set("event_date", e.target.value)} className={inputCls} required />
        </div>

        <div>
          <label className={labelCls}>End Date & Time (optional)</label>
          <input type="datetime-local" value={form.end_date} onChange={e => set("end_date", e.target.value)} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Venue</label>
          <input type="text" value={form.venue} onChange={e => set("venue", e.target.value)} className={inputCls} placeholder="Venue name" />
        </div>

        <div>
          <label className={labelCls}>Location</label>
          <input type="text" value={form.location} onChange={e => set("location", e.target.value)} className={inputCls} placeholder="City, State" />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>RSVP / Registration URL</label>
          <input type="url" value={form.rsvp_url} onChange={e => set("rsvp_url", e.target.value)} className={inputCls} placeholder="https://..." />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={e => set("excerpt", e.target.value)}
            className={`${inputCls} resize-none`}
            rows={2}
            placeholder="Short description shown in event cards and listings"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Content (Markdown)</label>
          <textarea
            value={form.content}
            onChange={e => set("content", e.target.value)}
            className={`${inputCls} resize-y font-mono text-xs`}
            rows={10}
            placeholder="Full event description, agenda, speaker info, etc..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("is_published", !form.is_published)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.is_published ? "bg-[#5B9BD5]" : "bg-slate-700"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.is_published ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-slate-300 text-sm font-medium">
              {form.is_published ? "Published (live on site)" : "Draft (hidden from public)"}
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#5B9BD5] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#3D7FC1] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Event"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-700 text-slate-300 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
