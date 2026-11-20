import { useState } from "react";
import { getSupabaseClient } from "../../lib/supabase";

interface Props {
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  isPast: boolean;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function EventRegistrationForm({ eventId, eventTitle, eventSlug, isPast }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    notes: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (isPast) return null;

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    const { error } = await getSupabaseClient()
      .from("event_registrations")
      .insert({
        event_id: eventId,
        event_title: eventTitle,
        event_slug: eventSlug,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        notes: form.notes.trim(),
      });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("success");
    }
  };

  const inputCls =
    "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#24a4b9] focus:border-transparent text-sm transition-colors";
  const labelCls = "block text-slate-600 text-sm font-medium mb-1.5";

  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Registration Received!</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Thank you, <strong>{form.name}</strong>. You're registered for <strong>{eventTitle}</strong>.
          We'll follow up at <strong>{form.email}</strong> with confirmation details.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Register for This Event</h2>
        <p className="text-slate-500 text-sm">Fill out the form below and we'll confirm your spot.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="reg-name">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              className={inputCls}
              placeholder="Jane Smith"
              required
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="reg-email">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={e => set("email", e.target.value)}
              className={inputCls}
              placeholder="jane@example.com"
              required
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="reg-phone">
              Phone Number <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="reg-phone"
              type="tel"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
              className={inputCls}
              placeholder="(843) 555-0100"
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="reg-org">
              Organization <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="reg-org"
              type="text"
              value={form.organization}
              onChange={e => set("organization", e.target.value)}
              className={inputCls}
              placeholder="Company or organization"
            />
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="reg-notes">
            Notes or Accommodations <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="reg-notes"
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Any questions, dietary needs, accessibility requests, or other notes..."
          />
        </div>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{errorMsg || "Something went wrong. Please try again."}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-[#24a4b9] text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1d8a9d] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Register Now
            </>
          )}
        </button>

        <p className="text-center text-slate-400 text-xs">
          Your information is kept private and used only for event coordination.
        </p>
      </form>
    </div>
  );
}
