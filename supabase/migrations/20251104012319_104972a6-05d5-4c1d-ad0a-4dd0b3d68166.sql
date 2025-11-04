-- Verificação profissional
CREATE TABLE IF NOT EXISTS public.professional_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  legal_id TEXT,
  company TEXT,
  website TEXT,
  portfolio_url TEXT,
  attachment_urls JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_id UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Blog: categorias
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog: posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog: relação post-categoria (many-to-many)
CREATE TABLE IF NOT EXISTS public.blog_post_categories (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Loja: produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loja: preços por segmento
CREATE TABLE IF NOT EXISTS public.product_prices (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  segment TEXT NOT NULL CHECK (segment IN ('professional')),
  currency TEXT NOT NULL DEFAULT 'BRL',
  amount_cents INT NOT NULL CHECK (amount_cents >= 0),
  PRIMARY KEY (product_id, segment)
);

-- Loja: inventário
CREATE TABLE IF NOT EXISTS public.inventory (
  product_id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loja: pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','canceled','fulfilled')),
  currency TEXT NOT NULL DEFAULT 'BRL',
  total_cents INT NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loja: itens do pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  qty INT NOT NULL CHECK (qty > 0),
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  PRIMARY KEY (order_id, product_id)
);

-- RLS: professional_verifications
ALTER TABLE public.professional_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification"
ON public.professional_verifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification"
ON public.professional_verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending verification"
ON public.professional_verifications FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all verifications"
ON public.professional_verifications FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all verifications"
ON public.professional_verifications FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- RLS: blog_categories
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.blog_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.blog_categories FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS: blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all posts"
ON public.blog_posts FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage posts"
ON public.blog_posts FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS: blog_post_categories
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post categories"
ON public.blog_post_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage post categories"
ON public.blog_post_categories FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS: products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible products"
ON public.products FOR SELECT
USING (visible = true);

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS: product_prices
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view prices"
ON public.product_prices FOR SELECT
USING (has_role(auth.uid(), 'professional') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage prices"
ON public.product_prices FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS: inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view inventory"
ON public.inventory FOR SELECT
USING (true);

CREATE POLICY "Admins can manage inventory"
ON public.inventory FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS: orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- RLS: order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()
));

CREATE POLICY "Users can insert their order items"
ON public.order_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()
));

CREATE POLICY "Admins can manage order items"
ON public.order_items FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Triggers
CREATE TRIGGER update_professional_verifications_updated_at
BEFORE UPDATE ON public.professional_verifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('professional-verifications', 'professional-verifications', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload their verification files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'professional-verifications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their verification files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'professional-verifications' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all verification files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'professional-verifications' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));