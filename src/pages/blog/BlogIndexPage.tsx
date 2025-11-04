import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/seo/Seo";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BlogCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
  categories: { name: string; slug: string }[];
}

export default function BlogIndexPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id, slug, title, excerpt, cover_url, published_at, blog_post_categories(category:blog_categories(name, slug))"
        )
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(24);

      if (error) throw error;

      return (data ?? []).map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        cover_url: post.cover_url,
        published_at: post.published_at,
        categories: (post.blog_post_categories ?? []).map((item: any) => item.category).filter(Boolean),
      })) as BlogCard[];
    },
  });

  return (
    <>
      <Seo
        title="Blog SMARTx — Estratégia, cultura e negócios para música"
        description="Artigos otimizados para SEO, cobrindo carreira, produtos e bastidores da indústria musical."
      />
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Blog</p>
        <h1 className="text-3xl font-semibold text-white">Insights para artistas e profissionais da música</h1>
        <p className="max-w-2xl text-sm text-zinc-400">
          Estratégia, marketing, tecnologia e oportunidades — tudo que impulsiona negócios musicais com linguagem acessível e SEO
          afiado para alcance orgânico.
        </p>
      </div>
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <span className="animate-pulse text-sm text-zinc-500">Carregando publicações...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data?.map((post) => (
            <article key={post.id} className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
              {post.cover_url && (
                <div className="aspect-[3/2] w-full bg-zinc-800">
                  <img src={post.cover_url} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-emerald-400">
                  {post.categories.map((category) => (
                    <span key={category.slug} className="rounded-full border border-emerald-500/30 px-3 py-1">
                      {category.name}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
                  {post.published_at && (
                    <time className="text-xs text-zinc-500">
                      {format(new Date(post.published_at), "dd MMM yyyy", { locale: ptBR })}
                    </time>
                  )}
                  {post.excerpt && <p className="text-sm text-zinc-400">{post.excerpt}</p>}
                </div>
                <Link to={`/blog/${post.slug}`} className="mt-auto text-sm font-medium text-emerald-400 hover:text-emerald-300">
                  Ler matéria
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
