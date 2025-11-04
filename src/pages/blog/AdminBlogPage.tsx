import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Seo from "@/components/seo/Seo";

interface BlogFormValues {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  cover_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  published: boolean;
  category_ids: string[];
}

export default function AdminBlogPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPostId, setSelectedPostId] = useState<string | "new">("new");
  const [isUploading, setIsUploading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["blog-categories-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("id, name, slug")
        .order("name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["blog-posts-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, content, cover_url, published, seo_title, seo_description, blog_post_categories(category_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((post) => ({
        ...post,
        category_ids: (post.blog_post_categories ?? []).map((item: any) => item.category_id),
      }));
    },
  });

  const selectedPost = selectedPostId === "new" ? null : posts?.find((post) => post.id === selectedPostId) ?? null;

  const { register, handleSubmit, reset, setValue, watch } = useForm<BlogFormValues>({
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      cover_url: "",
      seo_title: "",
      seo_description: "",
      published: false,
      category_ids: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      const payload = {
        slug: values.slug,
        title: values.title,
        excerpt: values.excerpt ?? null,
        content: values.content ?? null,
        cover_url: values.cover_url ?? null,
        seo_title: values.seo_title ?? null,
        seo_description: values.seo_description ?? null,
        published: values.published,
        published_at: values.published ? new Date().toISOString() : null,
      };

      if (values.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", values.id);
        if (error) throw error;
        await supabase.from("blog_post_categories").delete().eq("post_id", values.id);
        if (values.category_ids.length) {
          const inserts = values.category_ids.map((category_id) => ({ post_id: values.id!, category_id }));
          const { error: relationError } = await supabase.from("blog_post_categories").insert(inserts);
          if (relationError) throw relationError;
        }
        return values.id;
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({ ...payload, author_id: null })
        .select("id")
        .single();
      if (error) throw error;
      const postId = data.id;
      if (values.category_ids.length) {
        const inserts = values.category_ids.map((category_id) => ({ post_id: postId, category_id }));
        const { error: relationError } = await supabase.from("blog_post_categories").insert(inserts);
        if (relationError) throw relationError;
      }
      return postId as string;
    },
    onSuccess: (postId) => {
      toast({ title: "Post salvo com sucesso" });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-admin"] });
      setSelectedPostId(postId);
    },
    onError: (error) => {
      toast({ title: "Erro ao salvar", description: (error as Error).message, variant: "destructive" });
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate({ ...values, id: selectedPost?.id });
  });

  function handlePostChange(postId: string) {
    setSelectedPostId(postId);
    if (postId === "new") {
      reset({
        id: undefined,
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        cover_url: "",
        seo_title: "",
        seo_description: "",
        published: false,
        category_ids: [],
      });
      return;
    }

    const post = posts?.find((item) => item.id === postId);
    if (post) {
      reset({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        cover_url: post.cover_url,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
        published: Boolean(post.published),
        category_ids: post.category_ids ?? [],
      });
    }
  }

  async function handleCoverUpload(file?: File | null) {
    if (!file) return;
    setIsUploading(true);
    try {
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("blog").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });
      if (error) throw error;
      const { data: publicData } = supabase.storage.from("blog").getPublicUrl(data.path);
      setValue("cover_url", publicData.publicUrl ?? "");
      toast({ title: "Capa enviada com sucesso" });
    } catch (error) {
      toast({ title: "Falha no upload", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <Seo title="Admin Blog — SMARTx" description="Gerencie posts e categorias do blog SMARTx." />
      <div className="mb-10 flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-white">Administração do Blog</h1>
        <p className="text-sm text-zinc-400">
          Gerencie publicações, categorias e otimize SEO para atrair novos profissionais ao ecossistema SMARTx.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <h2 className="text-sm font-semibold text-white">Publicações</h2>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handlePostChange("new")}
                className={cn(
                  "rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  selectedPostId === "new" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"
                )}
              >
                Novo post
              </button>
              {posts?.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => handlePostChange(post.id)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    selectedPostId === post.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"
                  )}
                >
                  {post.title}
                </button>
              ))}
            </div>
          </div>
          <CategoryManager />
        </aside>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Título do post" {...register("title", { required: true })} />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="url-amigavel" {...register("slug", { required: true })} />
              </div>
            </div>
            <div>
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea id="excerpt" rows={3} placeholder="Resumo para cards e SEO" {...register("excerpt")} />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <ReactQuill theme="snow" value={watch("content") ?? ""} onChange={(value) => setValue("content", value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="cover">Capa</Label>
                <Input id="cover" placeholder="URL da imagem" {...register("cover_url")} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cover-upload">Upload de capa</Label>
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleCoverUpload(event.target.files?.[0])}
                  disabled={isUploading}
                />
                {isUploading && <span className="text-xs text-zinc-500">Enviando...</span>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input id="seo_title" placeholder="Título otimizado" {...register("seo_title")} />
              </div>
              <div>
                <Label htmlFor="seo_description">Meta Description</Label>
                <Textarea id="seo_description" rows={2} placeholder="Descrição para mecanismos de busca" {...register("seo_description")} />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Categorias</Label>
              <div className="flex flex-wrap gap-2">
                {categories?.map((category) => {
                  const active = watch("category_ids")?.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        const current = new Set(watch("category_ids") ?? []);
                        if (current.has(category.id)) {
                          current.delete(category.id);
                        } else {
                          current.add(category.id);
                        }
                        setValue("category_ids", Array.from(current));
                      }}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition-colors",
                        active
                          ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-700 text-zinc-400 hover:border-emerald-500/50"
                      )}
                    >
                      {category.name}
                    </button>
                  );
                })}
                {!categories?.length && <span className="text-xs text-zinc-500">Cadastre categorias ao lado.</span>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" {...register("published")} /> Publicar agora
              </label>
              {selectedPost?.published && <span className="text-xs text-emerald-400">Publicado</span>}
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar post"}
            </Button>
          </form>
        </section>
      </div>
    </>
  );
}

function CategoryManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<{ name: string; slug: string }>({
    defaultValues: { name: "", slug: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: { name: string; slug: string }) => {
      const { error } = await supabase.from("blog_categories").insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Categoria criada" });
      reset();
      queryClient.invalidateQueries({ queryKey: ["blog-categories-admin"] });
    },
    onError: (error) => {
      toast({ title: "Erro ao criar categoria", description: (error as Error).message, variant: "destructive" });
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="text-sm font-semibold text-white">Categorias</h2>
      <p className="mt-1 text-xs text-zinc-500">Crie novas categorias para organizar o conteúdo.</p>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div className="space-y-1">
          <Label htmlFor="category-name">Nome</Label>
          <Input id="category-name" placeholder="Nome da categoria" {...register("name", { required: true })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="category-slug">Slug</Label>
          <Input id="category-slug" placeholder="slug" {...register("slug", { required: true })} />
        </div>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Adicionar"}
        </Button>
      </form>
    </div>
  );
}
