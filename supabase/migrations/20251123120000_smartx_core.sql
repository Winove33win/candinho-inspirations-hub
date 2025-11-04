set check_function_bodies = off;

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Tables -----------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member','artist','professional','admin')),
  created_at timestamptz default now()
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  stage_name text,
  country text,
  city text,
  avatar_url text,
  cover_url text,
  created_at timestamptz default now()
);

create table if not exists public.professional_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  legal_id text,
  company text,
  website text,
  portfolio_url text,
  attachment_urls jsonb,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewer_id uuid references public.user_profiles(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_url text,
  author_id uuid references public.user_profiles(id),
  published boolean default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.blog_post_categories (
  post_id uuid references public.blog_posts(id) on delete cascade,
  category_id uuid references public.blog_categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  gallery_urls jsonb,
  visible boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.product_prices (
  product_id uuid references public.products(id) on delete cascade,
  segment text not null check (segment in ('professional')),
  currency text not null default 'BRL',
  amount_cents int not null,
  primary key (product_id, segment)
);

create table if not exists public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  stock int not null default 0
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id),
  status text not null default 'pending' check (status in ('pending','paid','canceled','fulfilled')),
  currency text not null default 'BRL',
  total_cents int not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  qty int not null check (qty > 0),
  price_cents int not null,
  primary key (order_id, product_id)
);

-- Helper functions --------------------------------------------------------
create or replace function public.current_user_role(p_user uuid default auth.uid())
returns text
language sql
security definer
set search_path = public
as $$
  select role from public.user_profiles where id = p_user;
$$;

create or replace function public.is_admin(p_user uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(current_user_role(p_user) = 'admin', false);
$$;

create or replace function public.is_professional(p_user uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(current_user_role(p_user) in ('professional','admin'), false);
$$;

-- Trigger to maintain updated_at ------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'professional_verifications_set_updated_at'
  ) then
    create trigger professional_verifications_set_updated_at
      before update on public.professional_verifications
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgname = 'blog_posts_set_updated_at'
  ) then
    create trigger blog_posts_set_updated_at
      before update on public.blog_posts
      for each row execute function public.set_updated_at();
  end if;
end;
$$;

-- Storage bucket for verification attachments -----------------------------------
select
  case
    when not exists (
      select 1 from storage.buckets where id = 'verifications'
    ) then storage.create_bucket('verifications', jsonb_build_object('public', false))
    else null
  end;

select
  case
    when not exists (
      select 1 from storage.buckets where id = 'blog'
    ) then storage.create_bucket('blog', jsonb_build_object('public', true))
    else null
  end;

select
  case
    when not exists (
      select 1 from storage.buckets where id = 'products'
    ) then storage.create_bucket('products', jsonb_build_object('public', true))
    else null
  end;

-- Row Level Security -------------------------------------------------------------
alter table public.user_profiles enable row level security;
alter table public.artists enable row level security;
alter table public.professional_verifications enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_prices enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- user_profiles policies
create policy if not exists user_profiles_self_select on public.user_profiles
  for select using ( id = auth.uid() or is_admin() );

create policy if not exists user_profiles_self_insert on public.user_profiles
  for insert with check ( id = auth.uid() );

create policy if not exists user_profiles_self_update on public.user_profiles
  for update using ( id = auth.uid() ) with check ( id = auth.uid() );

create policy if not exists user_profiles_admin_all on public.user_profiles
  for all using ( is_admin() );

-- artists policies
create policy if not exists artists_public_select on public.artists
  for select using ( true );

create policy if not exists artists_owner_crud on public.artists
  for all using ( user_id = auth.uid() or is_admin() )
  with check ( user_id = auth.uid() or is_admin() );

-- professional_verifications policies
create policy if not exists professional_verifications_owner_read on public.professional_verifications
  for select using ( user_id = auth.uid() or is_admin() );

create policy if not exists professional_verifications_owner_insert on public.professional_verifications
  for insert with check ( user_id = auth.uid() );

create policy if not exists professional_verifications_owner_update_pending on public.professional_verifications
  for update using ( user_id = auth.uid() and status = 'pending' )
  with check ( user_id = auth.uid() );

create policy if not exists professional_verifications_admin_manage on public.professional_verifications
  for update using ( is_admin() ) with check ( is_admin() );

-- blog policies
create policy if not exists blog_categories_public_select on public.blog_categories
  for select using ( true );

create policy if not exists blog_categories_admin_crud on public.blog_categories
  for all using ( is_admin() ) with check ( is_admin() );

create policy if not exists blog_posts_public_published on public.blog_posts
  for select using ( published = true or is_admin() );

create policy if not exists blog_posts_admin_crud on public.blog_posts
  for all using ( is_admin() ) with check ( is_admin() );

create policy if not exists blog_post_categories_public_select on public.blog_post_categories
  for select using ( true );

create policy if not exists blog_post_categories_admin_crud on public.blog_post_categories
  for all using ( is_admin() ) with check ( is_admin() );

-- product policies
create policy if not exists products_public_select on public.products
  for select using ( visible = true or is_admin() );

create policy if not exists products_admin_crud on public.products
  for all using ( is_admin() ) with check ( is_admin() );

create policy if not exists product_prices_professional_select on public.product_prices
  for select using ( is_professional() );

create policy if not exists product_prices_admin_crud on public.product_prices
  for all using ( is_admin() ) with check ( is_admin() );

create policy if not exists inventory_admin_all on public.inventory
  for all using ( is_admin() ) with check ( is_admin() );

-- orders policies
create policy if not exists orders_owner_select on public.orders
  for select using ( user_id = auth.uid() or is_admin() );

create policy if not exists orders_owner_insert on public.orders
  for insert with check ( user_id = auth.uid() or is_admin() );

create policy if not exists orders_owner_update on public.orders
  for update using ( user_id = auth.uid() or is_admin() )
  with check ( user_id = auth.uid() or is_admin() );

create policy if not exists order_items_owner_select on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or is_admin())
    )
  );

create policy if not exists order_items_owner_insert on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or is_admin())
    )
  );

create policy if not exists order_items_owner_update on public.order_items
  for update using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or is_admin())
    )
  ) with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or is_admin())
    )
  );

-- Storage policies
create policy if not exists storage_blog_public_read on storage.objects
  for select using ( bucket_id = 'blog' );

create policy if not exists storage_blog_admin_manage on storage.objects
  for all using ( bucket_id = 'blog' and is_admin() )
  with check ( bucket_id = 'blog' and is_admin() );

create policy if not exists storage_products_public_read on storage.objects
  for select using ( bucket_id = 'products' );

create policy if not exists storage_products_admin_manage on storage.objects
  for all using ( bucket_id = 'products' and is_admin() )
  with check ( bucket_id = 'products' and is_admin() );

-- Helper views and RPC ----------------------------------------------------------
create or replace view public.v_products_for_user as
select
  p.id,
  p.slug,
  p.name,
  p.description,
  p.gallery_urls,
  p.visible,
  p.created_at,
  case when is_professional() then pr.amount_cents else null end as professional_price_cents,
  case when is_professional() then pr.currency else null end as professional_price_currency
from public.products p
left join public.product_prices pr
  on pr.product_id = p.id and pr.segment = 'professional';

-- Admin helper to ensure reviewer id fallback
create or replace function public.default_reviewer(p_reviewer uuid)
returns uuid
language sql
as $$
  select coalesce(p_reviewer, auth.uid());
$$;

create or replace function public.admin_approve_verification(
  p_verification_id uuid,
  p_notes text default null
)
returns public.professional_verifications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.professional_verifications;
begin
  if not is_admin() then
    raise exception 'Only admins can approve verifications';
  end if;

  update public.professional_verifications
    set status = 'approved',
        notes = coalesce(p_notes, notes),
        reviewer_id = default_reviewer(reviewer_id),
        reviewed_at = now(),
        updated_at = now()
    where id = p_verification_id
    returning * into v_record;

  if not found then
    raise exception 'Verification % not found', p_verification_id;
  end if;

  update public.user_profiles
    set role = 'professional'
    where id = v_record.user_id;

  return v_record;
end;
$$;

create or replace function public.admin_reject_verification(
  p_verification_id uuid,
  p_notes text default null
)
returns public.professional_verifications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.professional_verifications;
begin
  if not is_admin() then
    raise exception 'Only admins can reject verifications';
  end if;

  update public.professional_verifications
    set status = 'rejected',
        notes = coalesce(p_notes, notes),
        reviewer_id = default_reviewer(reviewer_id),
        reviewed_at = now(),
        updated_at = now()
    where id = p_verification_id
    returning * into v_record;

  if not found then
    raise exception 'Verification % not found', p_verification_id;
  end if;

  update public.user_profiles
    set role = case when role = 'professional' then 'member' else role end
    where id = v_record.user_id;

  return v_record;
end;
$$;

create or replace function public.get_product_with_price(
  p_product_slug text,
  p_user_id uuid default auth.uid()
)
returns table (
  id uuid,
  slug text,
  name text,
  description text,
  gallery_urls jsonb,
  visible boolean,
  created_at timestamptz,
  professional_price_cents int,
  professional_price_currency text
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.slug,
    p.name,
    p.description,
    p.gallery_urls,
    p.visible,
    p.created_at,
    case when is_professional(p_user_id) then pr.amount_cents else null end,
    case when is_professional(p_user_id) then pr.currency else null end
  from public.products p
  left join public.product_prices pr
    on pr.product_id = p.id and pr.segment = 'professional'
  where p.slug = p_product_slug;
$$;

create or replace function public.create_order(
  p_items jsonb,
  p_currency text default 'BRL'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_order_id uuid;
  v_total int := 0;
  v_item jsonb;
  v_product uuid;
  v_qty int;
  v_price int;
  v_currency text;
  v_segment text := 'professional';
  v_items_count int;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  if not is_professional(v_user) then
    raise exception 'Only professional members can create orders';
  end if;

  select count(*) into v_items_count from jsonb_array_elements(p_items);
  if coalesce(v_items_count, 0) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  insert into public.orders (user_id, status, currency, total_cents)
    values (v_user, 'pending', p_currency, 0)
    returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product := (v_item->>'product_id')::uuid;
    v_qty := coalesce((v_item->>'qty')::int, 0);

    if v_product is null or v_qty <= 0 then
      raise exception 'Invalid order item payload';
    end if;

    select amount_cents, currency into v_price, v_currency
      from public.product_prices
      where product_id = v_product and segment = v_segment;

    if v_price is null then
      raise exception 'Product % unavailable for professionals', v_product;
    end if;

    insert into public.order_items (order_id, product_id, qty, price_cents)
      values (v_order_id, v_product, v_qty, v_price);

    v_total := v_total + (v_qty * v_price);
  end loop;

  update public.orders
    set total_cents = v_total,
        currency = coalesce(v_currency, p_currency)
    where id = v_order_id;

  return v_order_id;
end;
$$;

comment on function public.create_order is 'Creates an order for the authenticated professional user using product_prices.segment="professional".';

