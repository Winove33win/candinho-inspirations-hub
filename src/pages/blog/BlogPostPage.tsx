import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/seo/Seo";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id, title, content, excerpt, cover_url, published_at, updated_at, seo_title, seo_description, author:author_id(full_name), blog_post_categories(category:blog_categories(name, slug))"
        )
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const categories = (data.blog_post_categories ?? []).map((item: any) => item.category).filter(Boolean);

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.seo_title ?? data.title,
        description: data.seo_description ?? data.excerpt ?? undefined,
        author: data.author?.full_name ?? undefined,
        image: data.cover_url ?? undefined,
        datePublished: data.published_at ?? undefined,
        dateModified: data.updated_at ?? undefined,
        keywords: categories.map((category: any) => category?.name).filter(Boolean).join(", ") || undefined,
      };

      return {
        ...data,
        categories,
        jsonLd,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="animate-pulse text-sm text-zinc-500">Carregando matéria...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
        <p className="text-lg text-zinc-400">Post não encontrado.</p>
      </div>
    );
  }

  const seoTitle = data.seo_title ?? data.title;
  const seoDescription = data.seo_description ?? data.excerpt ?? undefined;

  return (
    <>
      <Seo
        title={`${seoTitle} — Blog SMARTx`}
        description={seoDescription}
        openGraph={[
          { property: "og:title", content: seoTitle },
          { property: "og:description", content: seoDescription ?? "" },
          ...(data.cover_url ? [{ property: "og:image", content: data.cover_url }] : []),
        ]}
        jsonLd={data.jsonLd}
      />
      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-emerald-400">
            {data.categories.map((category: any) => (
              <Link key={category.slug} to={`/blog?category=${category.slug}`} className="rounded-full border border-emerald-500/30 px-3 py-1">
                {category.name}
              </Link>
            ))}
          </div>
          <h1 className="text-4xl font-semibold text-white">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            {data.author?.full_name && <span>Por {data.author.full_name}</span>}
            {data.published_at && (
              <time>{format(new Date(data.published_at), "dd MMM yyyy", { locale: ptBR })}</time>
            )}
          </div>
          {data.cover_url && (
            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <img src={data.cover_url} alt={data.title} className="h-auto w-full object-cover" loading="lazy" />
            </div>
          )}
        </header>
        {data.content ? (
          <div
            className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-emerald-400"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}
          />
        ) : (
          <p className="text-sm text-zinc-400">Conteúdo em breve.</p>
        )}
      </article>
    </>
  );
}
