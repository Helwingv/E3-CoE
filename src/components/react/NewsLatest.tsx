import { useState, useEffect } from "react";
import { getSupabaseClient, type NewsArticle } from "../../lib/supabase";

export default function NewsLatest() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSupabaseClient()
      .from("news_articles")
      .select("id,title,slug,excerpt,category,author,image_url,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(9)
      .then(({ data }) => {
        setArticles(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#24a4b9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-[#24a4b9] text-sm font-bold uppercase tracking-widest mb-3">From The Newsroom</div>
            <h2 className="text-4xl font-bold text-slate-900">Latest Articles</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {articles.map(article => (
            <a
              key={article.id}
              href={`/news/${article.slug}`}
              className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-200"
            >
              {article.image_url ? (
                <div className="h-44 overflow-hidden bg-slate-100">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-[#24a4b9] bg-[#24a4b9]/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {article.category}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug mb-2 group-hover:text-[#24a4b9] transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-1 mt-4 text-[#24a4b9] text-sm font-semibold">
                  Read More
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
