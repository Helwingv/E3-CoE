import { useState, useEffect } from "react";
import { getSupabaseClient, type NewsArticle } from "../../lib/supabase";
import { TABLES } from "../../lib/tables";

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  "Press Release": { label: "Press Release", color: "text-blue-700", bg: "bg-blue-50" },
  "Event Recap": { label: "Event Recap", color: "text-emerald-700", bg: "bg-emerald-50" },
  "Research": { label: "Research", color: "text-amber-700", bg: "bg-amber-50" },
  "Partner News": { label: "Partner News", color: "text-teal-700", bg: "bg-teal-50" },
  "Policy": { label: "Policy Update", color: "text-slate-700", bg: "bg-slate-100" },
  "Media": { label: "Media Coverage", color: "text-rose-700", bg: "bg-rose-50" },
  "General": { label: "General", color: "text-slate-700", bg: "bg-slate-100" },
};

export default function NewsFilter() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getSupabaseClient()
      .from(TABLES.news)
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setArticles(data ?? []);
        setLoading(false);
      });
  }, []);

  const categories = ["all", ...Array.from(new Set(articles.map(a => a.category)))];

  const filtered = articles.filter((item) => {
    const matchesCategory = activeFilter === "all" || item.category === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      item.title.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#5B9BD5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl">
        <p className="text-slate-400 font-medium">No news articles published yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by topic, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B9BD5] focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
              activeFilter === cat
                ? "bg-slate-900 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat === "all" ? "All News" : (categoryConfig[cat]?.label ?? cat)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">No results found for your search.</p>
          <button
            onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
            className="mt-4 text-[#5B9BD5] font-semibold hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const cat = categoryConfig[item.category] ?? categoryConfig["General"];
            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col group"
              >
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${cat.bg} ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {new Date(item.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-3 group-hover:text-[#5B9BD5] transition-colors duration-150">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">{item.author}</span>
                  </div>
                </div>
                <div className="px-7 pb-6">
                  <a
                    href={`/news/${item.slug}`}
                    className="block text-center border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-semibold text-xs hover:border-[#5B9BD5] hover:text-[#5B9BD5] transition-colors duration-150"
                  >
                    Read Full Story &rarr;
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Showing {filtered.length} of {articles.length} stories
        </p>
      </div>
    </div>
  );
}
