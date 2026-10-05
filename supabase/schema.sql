-- ============================================================================
-- MARCELA CARDOSO IMÓVEIS - ESTRUTURA SQL COMPLETA PARA SUPABASE
-- Execute este script no SQL Editor do seu projeto no Supabase.
-- ============================================================================

-- 1. Extensão para geração de UUIDs
create extension if not exists "pgcrypto";

-- 2. Tabela principal de imóveis (properties)
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  property_type text not null check (property_type in ('house', 'apartment', 'penthouse', 'villa', 'land', 'commercial')),
  purpose text not null check (purpose in ('sale', 'rent', 'both')),
  price numeric(14, 2) not null default 0,
  condominium_fee numeric(12, 2) default 0,
  iptu numeric(12, 2) default 0,
  city text not null,
  state text not null default 'PA',
  neighborhood text not null,
  address text default '',
  bedrooms integer not null default 0,
  suites integer not null default 0,
  bathrooms integer not null default 0,
  parking_spaces integer not null default 0,
  total_area numeric(10, 2) not null default 0,
  built_area numeric(10, 2) default 0,
  status text not null default 'available' check (status in ('available', 'sold', 'rented', 'reserved')),
  featured boolean not null default false,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  features text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Tabela de fotos dos imóveis (property_images)
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  is_cover boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Índices para performance em filtros e buscas
create index if not exists idx_properties_slug on public.properties(slug);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_featured on public.properties(featured);
create index if not exists idx_properties_type_purpose on public.properties(property_type, purpose);
create index if not exists idx_properties_city_neighborhood on public.properties(city, neighborhood);
create index if not exists idx_properties_price on public.properties(price);
create index if not exists idx_property_images_property_id on public.property_images(property_id, display_order);

-- 5. Trigger para atualizar automaticamente o campo updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row execute function public.handle_updated_at();

-- ============================================================================
-- 6. SEGURANÇA: ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table public.properties enable row level security;
alter table public.property_images enable row level security;

-- Políticas para visitantes públicos (leitura de imóveis e imagens)
drop policy if exists "Visitantes podem visualizar imoveis" on public.properties;
create policy "Visitantes podem visualizar imoveis"
  on public.properties
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Visitantes podem visualizar imagens dos imoveis" on public.property_images;
create policy "Visitantes podem visualizar imagens dos imoveis"
  on public.property_images
  for select
  to anon, authenticated
  using (true);

-- Políticas para administradores autenticados (criar, editar, excluir)
drop policy if exists "Administradores podem inserir imoveis" on public.properties;
create policy "Administradores podem inserir imoveis"
  on public.properties
  for insert
  to authenticated
  with check (true);

drop policy if exists "Administradores podem atualizar imoveis" on public.properties;
create policy "Administradores podem atualizar imoveis"
  on public.properties
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Administradores podem excluir imoveis" on public.properties;
create policy "Administradores podem excluir imoveis"
  on public.properties
  for delete
  to authenticated
  using (true);

drop policy if exists "Administradores podem inserir imagens" on public.property_images;
create policy "Administradores podem inserir imagens"
  on public.property_images
  for insert
  to authenticated
  with check (true);

drop policy if exists "Administradores podem atualizar imagens" on public.property_images;
create policy "Administradores podem atualizar imagens"
  on public.property_images
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Administradores podem excluir imagens" on public.property_images;
create policy "Administradores podem excluir imagens"
  on public.property_images
  for delete
  to authenticated
  using (true);

-- ============================================================================
-- 7. SUPABASE STORAGE: BUCKET 'property-images'
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- Políticas de acesso ao Storage
drop policy if exists "Imagens dos imoveis sao publicas para visualizacao" on storage.objects;
create policy "Imagens dos imoveis sao publicas para visualizacao"
  on storage.objects
  for select
  to public
  using (bucket_id = 'property-images');

drop policy if exists "Usuarios autenticados podem enviar imagens" on storage.objects;
create policy "Usuarios autenticados podem enviar imagens"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "Usuarios autenticados podem atualizar imagens" on storage.objects;
create policy "Usuarios autenticados podem atualizar imagens"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'property-images');

drop policy if exists "Usuarios autenticados podem excluir imagens" on storage.objects;
create policy "Usuarios autenticados podem excluir imagens"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'property-images');
