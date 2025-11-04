import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProductFormValues {
  id?: string;
  slug: string;
  name: string;
  description: string;
  gallery_urls: string;
  price_cents: number;
  stock: number;
  visible: boolean;
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<string | "new">("new");
  const [isUploading, setIsUploading] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, description, gallery_urls, visible, product_prices(amount_cents, currency), inventory(stock)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((item) => ({
        ...item,
        price_cents: item.product_prices?.[0]?.amount_cents ?? 0,
        currency: item.product_prices?.[0]?.currency ?? "BRL",
        stock: item.inventory?.stock ?? 0,
      }));
    },
  });

  const form = useForm<ProductFormValues>({
    defaultValues: {
      slug: "",
      name: "",
      description: "",
      gallery_urls: "",
      price_cents: 0,
      stock: 0,
      visible: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const gallery = values.gallery_urls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      const productPayload = {
        slug: values.slug,
        name: values.name,
        description: values.description,
        gallery_urls: gallery,
        visible: values.visible,
      };

      let productId = values.id;
      if (productId) {
        const { error } = await supabase.from("products").update(productPayload).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productPayload)
          .select("id")
          .single();
        if (error) throw error;
        productId = data.id;
      }

      if (!productId) throw new Error("Falha ao identificar o produto");

      const pricePayload = {
        product_id: productId,
        segment: "professional" as const,
        amount_cents: values.price_cents,
        currency: "BRL",
      };

      const { error: priceError } = await supabase
        .from("product_prices")
        .upsert(pricePayload, { onConflict: "product_id,segment" });
      if (priceError) throw priceError;

      const { error: stockError } = await supabase
        .from("inventory")
        .upsert({ product_id: productId, stock: values.stock }, { onConflict: "product_id" });
      if (stockError) throw stockError;

      return productId;
    },
    onSuccess: (id) => {
      toast({ title: "Produto salvo" });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setSelectedProductId(id);
    },
    onError: (error) => {
      toast({ title: "Erro ao salvar produto", description: (error as Error).message, variant: "destructive" });
    },
  });

  function handleProductChange(id: string) {
    setSelectedProductId(id);
    if (id === "new") {
      form.reset({
        id: undefined,
        slug: "",
        name: "",
        description: "",
        gallery_urls: "",
        price_cents: 0,
        stock: 0,
        visible: true,
      });
      return;
    }

    const product = products?.find((item) => item.id === id);
    if (!product) return;
    form.reset({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description ?? "",
      gallery_urls: Array.isArray(product.gallery_urls) ? product.gallery_urls.join("\n") : "",
      price_cents: product.price_cents ?? 0,
      stock: product.stock ?? 0,
      visible: product.visible ?? true,
    });
  }

  async function handleGalleryUpload(files?: FileList | null) {
    if (!files?.length) return;
    setIsUploading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const path = `${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage.from("products").upload(path, file, {
            upsert: true,
            cacheControl: "3600",
          });
          if (error) throw error;
          const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(data.path);
          return publicUrl.publicUrl ?? "";
        })
      );
      const existing = form.getValues("gallery_urls");
      const merged = [existing, ...uploads.filter(Boolean)].filter(Boolean).join("\n");
      form.setValue("gallery_urls", merged.trim());
      toast({ title: "Galeria atualizada" });
    } catch (error) {
      toast({ title: "Erro no upload", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  }

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <h2 className="text-sm font-semibold text-white">Produtos</h2>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleProductChange("new")}
              className={cn(
                "rounded-xl px-3 py-2 text-left text-sm transition-colors",
                selectedProductId === "new" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"
              )}
            >
              Novo produto
            </button>
            {products?.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleProductChange(product.id)}
                className={cn(
                  "rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  selectedProductId === product.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900"
                )}
              >
                {product.name}
              </button>
            ))}
          </div>
        </div>
      </aside>
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...form.register("name", { required: true })} placeholder="Nome do produto" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...form.register("slug", { required: true })} placeholder="identificador" />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" rows={4} {...form.register("description")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Preço (centavos)</Label>
              <Input id="price" type="number" min={0} {...form.register("price_cents", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="stock">Estoque</Label>
              <Input id="stock" type="number" min={0} {...form.register("stock", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="gallery">Galeria (URLs, uma por linha)</Label>
              <Textarea id="gallery" rows={4} {...form.register("gallery_urls")} placeholder="https://imagem-1.jpg" />
            </div>
            <div>
              <Label htmlFor="gallery-upload">Upload de imagens</Label>
              <Input id="gallery-upload" type="file" accept="image/*" multiple onChange={(event) => handleGalleryUpload(event.target.files)} disabled={isUploading} />
              {isUploading && <span className="text-xs text-zinc-500">Enviando imagens...</span>}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" {...form.register("visible")} /> Produto visível
          </label>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar produto"}
          </Button>
        </form>
      </section>
    </div>
  );
}
