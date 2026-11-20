import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Session } from "@supabase/supabase-js";
import { SupabaseContext } from "./supabaseContext";
import AdminLogin from "./AdminLogin";
import NewsManager from "./NewsManager";
import EventsManager from "./EventsManager";
import RegistrationsManager from "./RegistrationsManager";

type Tab = "news" | "events" | "registrations";

function AdminShell({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("news");

  const navItem = (id: Tab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setTab(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
        tab === id
          ? "bg-[#24a4b9]/15 text-[#24a4b9] border border-[#24a4b9]/20"
          : "text-slate-400 hover:text-white hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <aside className="w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#24a4b9]/10 border border-[#24a4b9]/20 flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#24a4b9]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Vision 8:28</p>
              <p className="text-slate-500 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest px-4 mb-3">Content</p>
          {navItem(
            "news",
            "News Articles",
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          {navItem(
            "events",
            "Events",
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          {navItem(
            "registrations",
            "Registrations",
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-slate-400 text-xs truncate flex-1">{session.user.email}</p>
          </div>
          <div className="space-y-1">
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-slate-500 hover:text-slate-300 text-xs transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Site
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-slate-500 hover:text-red-400 text-xs transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {tab === "news" && <NewsManager />}
          {tab === "events" && <EventsManager />}
          {tab === "registrations" && <RegistrationsManager />}
        </div>
      </main>
    </div>
  );
}

interface AdminAppProps {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export default function AdminApp({ supabaseUrl, supabaseAnonKey }: AdminAppProps) {
  const supabase = useMemo(
    () => createClient(supabaseUrl, supabaseAnonKey),
    [supabaseUrl, supabaseAnonKey]
  );

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => {
      (() => { setSession(newSession); })();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#24a4b9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      {session ? (
        <AdminShell session={session} onLogout={handleLogout} />
      ) : (
        <AdminLogin />
      )}
    </SupabaseContext.Provider>
  );
}
