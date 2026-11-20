import { useState, useEffect } from "react";
import { type NewsArticle } from "../../../lib/supabase";
import { useAdminSupabase } from "./supabaseContext";

const CATEGORIES = ["General", "Announcement", "Policy", "Research", "Community Impact", "Media Coverage", "Partnership"];

const generateSlug = (title: string) =>
  title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

interface Props {
  article?: NewsArticle | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function NewsForm({ article, onSaved, onCancel }: Props) {
  const supabase = useAdminSupabase();
  const isEdit = !!article;
  const [form, setForm] = useState({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    category: article?.category ?? "General",
    author: article?.author ?? "",
    image_url: article?.image_url ?? "",
    published_at: article?.published_at ? article.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
    is_published: article?.is_published ?? false,
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
      published_at: new Date(form.published_at).toISOString(),
      updated_at: new Date().toISOString(),
    };

    let err;
    if (isEdit) {
      ({ error: err } = await supabase.from("news_articles").update(payload).eq("id", article!.id));
    } else {
      ({ error: err } = await supabase.from("news_articles").insert(payload));
    }

    if (err) {
      setError(err.message);
    } else {
      onSaved();
    }
    setSaving(false);
  };

  const inputCls = "w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#24a4b9] focus:border-transparent text-sm transition-colors";
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
            placeholder="Article headline"
            required
          />
        </div>

        <div>
          <label className={labelCls}>Slug *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">/news/</span>
            <input
              type="text"
              value={form.slug}
              onChange={e => { setSlugEdited(true); set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); }}
              className={`${inputCls} pl-14`}
              placeholder="article-slug"
              required
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Category</label>
          <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Author</label>
          <input type="text" value={form.author} onChange={e => set("author", e.target.value)} className={inputCls} placeholder="Author name" />
        </div>

        <div>
          <label className={labelCls}>Publish Date</label>
          <input type="date" value={form.published_at} onChange={e => set("published_at", e.target.value)} className={inputCls} />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Image URL</label>
          <input type="url" value={form.image_url} onChange={e => set("image_url", e.target.value)} className={inputCls} placeholder="https://images.pexels.com/..." />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={e => set("excerpt", e.target.value)}
            className={`${inputCls} resize-none`}
            rows={2}
            placeholder="Short summary shown in article cards and listings"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelCls}>Content (Markdown)</label>
          <textarea
            value={form.content}
            onChange={e => set("content", e.target.value)}
            className={`${inputCls} resize-y font-mono text-xs`}
            rows={12}
            placeholder="Full article body in Markdown format..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("is_published", !form.is_published)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.is_published ? "bg-[#24a4b9]" : "bg-slate-700"}`}
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
          className="bg-[#24a4b9] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1d8a9d] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Article"}
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
