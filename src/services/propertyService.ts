import { SITE_CONFIG } from '../config/siteConfig';
import { SEED_EXAMPLE_PROPERTIES } from '../data/seedExample';
import { isSupabaseConfigured, STORAGE_BUCKET, supabase } from '../lib/supabase';
import {
  AdminStats,
  Property,
  PropertyFilters,
  PropertyFormData,
  PropertyImage,
  PropertyStatus,
} from '../types/property';
import { generateSlug, getPropertyTypeLabel, getPurposeLabel } from '../utils/formatters';

const LOCAL_STORAGE_KEY = 'marcela_cardoso_properties_v1';

/**
 * Helper interno para leitura/escrita no modo de demonstração local
 * (utilizado somente quando VITE_SUPABASE_URL ainda não foi configurado no .env).
 */
function getLocalProperties(): Property[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_EXAMPLE_PROPERTIES));
      return [...SEED_EXAMPLE_PROPERTIES];
    }
    return JSON.parse(raw) as Property[];
  } catch {
    return [...SEED_EXAMPLE_PROPERTIES];
  }
}

function saveLocalProperties(properties: Property[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
  } catch (err) {
    console.error('Erro ao salvar dados locais:', err);
  }
}

function normalizePropertyImages(property: Property): Property {
  const sortedImages = [...(property.images || [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );
  return {
    ...property,
    features: Array.isArray(property.features) ? property.features : [],
    images: sortedImages,
  };
}

/**
 * Aplica filtros combinados sobre uma lista de imóveis
 */
function applyClientFilters(properties: Property[], filters?: PropertyFilters): Property[] {
  let list = properties.map(normalizePropertyImages);

  if (!filters) return list;

  // Filtro de status
  if (filters.status && filters.status !== 'all_admin' && filters.status !== 'all_public') {
    list = list.filter((p) => p.status === filters.status);
  } else if (filters.status === 'all_public' || !filters.status) {
    const allowedStatuses = filters.include_inactive_public
      ? (['available', 'reserved', 'sold', 'rented'] as PropertyStatus[])
      : SITE_CONFIG.defaultPublicStatuses;
    list = list.filter((p) => allowedStatuses.includes(p.status));
  }

  // Pesquisa textual combinada (título, cidade, bairro, tipo, finalidade)
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase().trim();
    list = list.filter((p) => {
      const typeLabel = getPropertyTypeLabel(p.property_type).toLowerCase();
      const purposeLabel = getPurposeLabel(p.purpose).toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        typeLabel.includes(q) ||
        purposeLabel.includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    });
  }

  if (filters.property_type) {
    list = list.filter((p) => p.property_type === filters.property_type);
  }

  if (filters.purpose) {
    list = list.filter(
      (p) => p.purpose === filters.purpose || p.purpose === 'both'
    );
  }

  if (filters.city && filters.city.trim() !== '') {
    const cityQuery = filters.city.toLowerCase().trim();
    list = list.filter((p) => p.city.toLowerCase().includes(cityQuery));
  }

  if (filters.neighborhood && filters.neighborhood.trim() !== '') {
    const neighborhoodQuery = filters.neighborhood.toLowerCase().trim();
    list = list.filter((p) => p.neighborhood.toLowerCase().includes(neighborhoodQuery));
  }

  if (filters.min_price !== undefined && filters.min_price !== '') {
    list = list.filter((p) => Number(p.price) >= Number(filters.min_price));
  }

  if (filters.max_price !== undefined && filters.max_price !== '') {
    list = list.filter((p) => Number(p.price) <= Number(filters.max_price));
  }

  if (filters.bedrooms !== undefined && filters.bedrooms !== '') {
    list = list.filter((p) => Number(p.bedrooms) >= Number(filters.bedrooms));
  }

  if (filters.bathrooms !== undefined && filters.bathrooms !== '') {
    list = list.filter((p) => Number(p.bathrooms) >= Number(filters.bathrooms));
  }

  if (filters.min_area !== undefined && filters.min_area !== '') {
    list = list.filter((p) => Number(p.total_area) >= Number(filters.min_area));
  }

  if (filters.max_area !== undefined && filters.max_area !== '') {
    list = list.filter((p) => Number(p.total_area) <= Number(filters.max_area));
  }

  // Ordenação
  const sort = filters.sort || 'newest';
  list.sort((a, b) => {
    if (sort === 'price_asc') return Number(a.price) - Number(b.price);
    if (sort === 'price_desc') return Number(b.price) - Number(a.price);
    if (sort === 'area_desc') return Number(b.total_area) - Number(a.total_area);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return list;
}

/**
 * Consulta imóveis com filtros combinados no Supabase (ou repositório local se .env não configurado)
 */
export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    return applyClientFilters(local, filters);
  }

  let query = supabase
    .from('properties')
    .select('*, images:property_images(*)');

  if (filters?.property_type) {
    query = query.eq('property_type', filters.property_type);
  }

  if (filters?.purpose) {
    query = query.in('purpose', [filters.purpose, 'both']);
  }

  if (filters?.min_price !== undefined && filters.min_price !== '') {
    query = query.gte('price', Number(filters.min_price));
  }

  if (filters?.max_price !== undefined && filters.max_price !== '') {
    query = query.lte('price', Number(filters.max_price));
  }

  if (filters?.bedrooms !== undefined && filters.bedrooms !== '') {
    query = query.gte('bedrooms', Number(filters.bedrooms));
  }

  if (filters?.bathrooms !== undefined && filters.bathrooms !== '') {
    query = query.gte('bathrooms', Number(filters.bathrooms));
  }

  if (filters?.min_area !== undefined && filters.min_area !== '') {
    query = query.gte('total_area', Number(filters.min_area));
  }

  if (filters?.max_area !== undefined && filters.max_area !== '') {
    query = query.lte('total_area', Number(filters.max_area));
  }

  if (filters?.status && filters.status !== 'all_admin' && filters.status !== 'all_public') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    // Caso a tabela ainda não tenha sido criada no SQL Editor do Supabase, usa o fallback local
    if (
      error.code === '42P01' ||
      error.message.includes('does not exist') ||
      error.message.includes('schema cache')
    ) {
      console.warn(
        'Tabela properties ainda não encontrada no Supabase. Exibindo dados de demonstração até que supabase/schema.sql seja executado.'
      );
      return applyClientFilters(getLocalProperties(), filters);
    }
    throw new Error(`Erro ao carregar imóveis do Supabase: ${error.message}`);
  }

  return applyClientFilters((data || []) as Property[], filters);
}

/**
 * Retorna os imóveis em destaque para a página inicial
 */
export async function getFeaturedProperties(limit = 4): Promise<Property[]> {
  if (!isSupabaseConfigured) {
    const all = applyClientFilters(getLocalProperties(), { status: 'all_public' });
    const featured = all.filter((p) => p.featured);
    return (featured.length > 0 ? featured : all).slice(0, limit);
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .eq('featured', true)
    .in('status', SITE_CONFIG.defaultPublicStatuses)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (
      error.code === '42P01' ||
      error.message.includes('does not exist') ||
      error.message.includes('schema cache')
    ) {
      const all = applyClientFilters(getLocalProperties(), { status: 'all_public' });
      return all.filter((p) => p.featured).slice(0, limit);
    }
    throw new Error(`Erro ao buscar imóveis em destaque: ${error.message}`);
  }

  const list = (data || []).map(normalizePropertyImages);
  if (list.length > 0) return list;

  // Fallback para os mais recentes caso nenhum esteja marcado como featured ainda
  const { data: recentData } = await supabase
    .from('properties')
    .select('*, images:property_images(*)')
    .in('status', SITE_CONFIG.defaultPublicStatuses)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (recentData || []).map(normalizePropertyImages);
}

/**
 * Busca um imóvel individual pelo slug ou pelo UUID
 */
export async function getPropertyBySlugOrId(slugOrId: string): Promise<Property | null> {
  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const found = local.find((p) => p.slug === slugOrId || p.id === slugOrId);
    return found ? normalizePropertyImages(found) : null;
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    slugOrId
  );

  let query = supabase.from('properties').select('*, images:property_images(*)');
  if (isUuid) {
    query = query.eq('id', slugOrId);
  } else {
    query = query.eq('slug', slugOrId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    if (
      error.code === '42P01' ||
      error.message.includes('does not exist') ||
      error.message.includes('schema cache')
    ) {
      const local = getLocalProperties();
      const found = local.find((p) => p.slug === slugOrId || p.id === slugOrId);
      return found ? normalizePropertyImages(found) : null;
    }
    throw new Error(`Erro ao carregar detalhes do imóvel: ${error.message}`);
  }

  if (!data && !isUuid) {
    // Tenta buscar por id caso não seja UUID padrão
    const { data: byId } = await supabase
      .from('properties')
      .select('*, images:property_images(*)')
      .eq('id', slugOrId)
      .maybeSingle();
    return byId ? normalizePropertyImages(byId as Property) : null;
  }

  return data ? normalizePropertyImages(data as Property) : null;
}

/**
 * Busca imóveis semelhantes (mesmo tipo ou mesma finalidade, excluindo o atual)
 */
export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  const all = await getProperties({ status: 'all_public' });
  const candidates = all.filter((item) => item.id !== property.id);

  const scored = candidates.map((item) => {
    let score = 0;
    if (item.property_type === property.property_type) score += 3;
    if (item.purpose === property.purpose) score += 2;
    if (item.neighborhood.toLowerCase() === property.neighborhood.toLowerCase()) score += 2;
    if (item.city.toLowerCase() === property.city.toLowerCase()) score += 1;
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Retorna estatísticas para o Dashboard Administrativo
 */
export async function getAdminStats(): Promise<AdminStats> {
  const all = await getProperties({ status: 'all_admin' });
  return {
    total: all.length,
    available: all.filter((p) => p.status === 'available').length,
    sold: all.filter((p) => p.status === 'sold').length,
    rented: all.filter((p) => p.status === 'rented').length,
    reserved: all.filter((p) => p.status === 'reserved').length,
    featured: all.filter((p) => p.featured).length,
  };
}

/**
 * Cria um novo imóvel
 */
export async function createProperty(formData: PropertyFormData): Promise<Property> {
  const cleanSlug =
    formData.slug.trim() ||
    `${generateSlug(formData.title)}-${Math.random().toString(36).substring(2, 6)}`;

  const payload = {
    title: formData.title.trim(),
    slug: cleanSlug,
    description: formData.description.trim(),
    property_type: formData.property_type,
    purpose: formData.purpose,
    price: Number(formData.price) || 0,
    condominium_fee: Number(formData.condominium_fee) || 0,
    iptu: Number(formData.iptu) || 0,
    city: formData.city.trim(),
    state: formData.state.trim() || 'PA',
    neighborhood: formData.neighborhood.trim(),
    address: formData.address.trim(),
    bedrooms: Number(formData.bedrooms) || 0,
    suites: Number(formData.suites) || 0,
    bathrooms: Number(formData.bathrooms) || 0,
    parking_spaces: Number(formData.parking_spaces) || 0,
    total_area: Number(formData.total_area) || 0,
    built_area: Number(formData.built_area) || 0,
    status: formData.status,
    featured: Boolean(formData.featured),
    latitude:
      formData.latitude !== '' && !Number.isNaN(Number(formData.latitude))
        ? Number(formData.latitude)
        : null,
    longitude:
      formData.longitude !== '' && !Number.isNaN(Number(formData.longitude))
        ? Number(formData.longitude)
        : null,
    features: formData.features.filter((f) => f.trim() !== ''),
  };

  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const newProperty: Property = {
      id: crypto.randomUUID ? crypto.randomUUID() : `prop-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [],
    };
    saveLocalProperties([newProperty, ...local]);
    return newProperty;
  }

  const { data, error } = await supabase
    .from('properties')
    .insert([payload])
    .select('*, images:property_images(*)')
    .single();

  if (error) {
    throw new Error(`Erro ao cadastrar imóvel: ${error.message}`);
  }

  return normalizePropertyImages(data as Property);
}

/**
 * Atualiza um imóvel existente
 */
export async function updateProperty(id: string, formData: PropertyFormData): Promise<Property> {
  const cleanSlug = formData.slug.trim() || generateSlug(formData.title);

  const payload = {
    title: formData.title.trim(),
    slug: cleanSlug,
    description: formData.description.trim(),
    property_type: formData.property_type,
    purpose: formData.purpose,
    price: Number(formData.price) || 0,
    condominium_fee: Number(formData.condominium_fee) || 0,
    iptu: Number(formData.iptu) || 0,
    city: formData.city.trim(),
    state: formData.state.trim() || 'PA',
    neighborhood: formData.neighborhood.trim(),
    address: formData.address.trim(),
    bedrooms: Number(formData.bedrooms) || 0,
    suites: Number(formData.suites) || 0,
    bathrooms: Number(formData.bathrooms) || 0,
    parking_spaces: Number(formData.parking_spaces) || 0,
    total_area: Number(formData.total_area) || 0,
    built_area: Number(formData.built_area) || 0,
    status: formData.status,
    featured: Boolean(formData.featured),
    latitude:
      formData.latitude !== '' && !Number.isNaN(Number(formData.latitude))
        ? Number(formData.latitude)
        : null,
    longitude:
      formData.longitude !== '' && !Number.isNaN(Number(formData.longitude))
        ? Number(formData.longitude)
        : null,
    features: formData.features.filter((f) => f.trim() !== ''),
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const index = local.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Imóvel não encontrado.');
    const updated: Property = {
      ...local[index],
      ...payload,
    };
    local[index] = updated;
    saveLocalProperties(local);
    return normalizePropertyImages(updated);
  }

  const { data, error } = await supabase
    .from('properties')
    .update(payload)
    .eq('id', id)
    .select('*, images:property_images(*)')
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar imóvel: ${error.message}`);
  }

  return normalizePropertyImages(data as Property);
}

/**
 * Altera rapidamente o status de um imóvel
 */
export async function updatePropertyStatus(
  id: string,
  status: PropertyStatus
): Promise<void> {
  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const updated = local.map((p) =>
      p.id === id ? { ...p, status, updated_at: new Date().toISOString() } : p
    );
    saveLocalProperties(updated);
    return;
  }

  const { error } = await supabase
    .from('properties')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    throw new Error(`Erro ao atualizar status: ${error.message}`);
  }
}

/**
 * Exclui um imóvel e remove seus arquivos do Supabase Storage
 */
export async function deleteProperty(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    saveLocalProperties(local.filter((p) => p.id !== id));
    return;
  }

  // Primeiro obtém as imagens para excluir do Storage
  const { data: images } = await supabase
    .from('property_images')
    .select('storage_path')
    .eq('property_id', id);

  if (images && images.length > 0) {
    const paths = images
      .map((img) => img.storage_path)
      .filter((p) => p && !p.startsWith('seed/'));
    if (paths.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    }
  }

  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) {
    throw new Error(`Erro ao excluir imóvel: ${error.message}`);
  }
}

/**
 * Converte File para DataURL (usado no modo de demonstração local sem Supabase Storage)
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Faz upload de múltiplas imagens para o bucket `property-images` do Supabase Storage
 * e registra cada foto na tabela `property_images`.
 */
export async function uploadPropertyImages(
  propertyId: string,
  files: File[],
  coverIndex: number | null,
  startingOrder = 0
): Promise<PropertyImage[]> {
  if (files.length === 0) return [];

  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const propIndex = local.findIndex((p) => p.id === propertyId);
    if (propIndex === -1) throw new Error('Imóvel não encontrado.');

    const existingImages = local[propIndex].images || [];
    const hasCoverAlready = existingImages.some((img) => img.is_cover);

    const newImages: PropertyImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const dataUrl = await fileToDataUrl(files[i]);
      const isCover =
        coverIndex !== null
          ? i === coverIndex
          : !hasCoverAlready && existingImages.length === 0 && i === 0;

      newImages.push({
        id: `img-${Date.now()}-${i}`,
        property_id: propertyId,
        image_url: dataUrl,
        storage_path: `local/${propertyId}/${files[i].name}`,
        is_cover: isCover,
        display_order: startingOrder + i,
        created_at: new Date().toISOString(),
      });
    }

    const updatedExisting =
      coverIndex !== null
        ? existingImages.map((img) => ({ ...img, is_cover: false }))
        : existingImages;

    local[propIndex].images = [...updatedExisting, ...newImages];
    saveLocalProperties(local);
    return newImages;
  }

  // Upload real para o Supabase Storage (bucket: property-images)
  const uploadedRecords: PropertyImage[] = [];

  if (coverIndex !== null) {
    await supabase
      .from('property_images')
      .update({ is_cover: false })
      .eq('property_id', propertyId);
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storagePath = `properties/${propertyId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Falha ao enviar imagem ${file.name}: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    const isCover = coverIndex !== null ? i === coverIndex : startingOrder === 0 && i === 0;

    const { data: insertedImage, error: dbError } = await supabase
      .from('property_images')
      .insert([
        {
          property_id: propertyId,
          image_url: publicUrlData.publicUrl,
          storage_path: storagePath,
          is_cover: isCover,
          display_order: startingOrder + i,
        },
      ])
      .select('*')
      .single();

    if (dbError) {
      throw new Error(`Erro ao salvar registro da imagem: ${dbError.message}`);
    }

    uploadedRecords.push(insertedImage as PropertyImage);
  }

  return uploadedRecords;
}

/**
 * Define uma imagem como foto principal (capa) do imóvel
 */
export async function setCoverImage(propertyId: string, imageId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const idx = local.findIndex((p) => p.id === propertyId);
    if (idx === -1) return;
    local[idx].images = (local[idx].images || []).map((img) => ({
      ...img,
      is_cover: img.id === imageId,
    }));
    saveLocalProperties(local);
    return;
  }

  await supabase
    .from('property_images')
    .update({ is_cover: false })
    .eq('property_id', propertyId);

  const { error } = await supabase
    .from('property_images')
    .update({ is_cover: true })
    .eq('id', imageId);

  if (error) {
    throw new Error(`Erro ao definir foto principal: ${error.message}`);
  }
}

/**
 * Exclui uma imagem individual do imóvel (Storage + Banco)
 */
export async function deletePropertyImage(
  propertyId: string,
  image: PropertyImage
): Promise<void> {
  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const idx = local.findIndex((p) => p.id === propertyId);
    if (idx === -1) return;
    const remaining = (local[idx].images || []).filter((img) => img.id !== image.id);
    if (image.is_cover && remaining.length > 0) {
      remaining[0].is_cover = true;
    }
    local[idx].images = remaining;
    saveLocalProperties(local);
    return;
  }

  if (image.storage_path && !image.storage_path.startsWith('seed/')) {
    await supabase.storage.from(STORAGE_BUCKET).remove([image.storage_path]);
  }

  const { error } = await supabase.from('property_images').delete().eq('id', image.id);
  if (error) {
    throw new Error(`Erro ao excluir imagem: ${error.message}`);
  }
}

/**
 * Atualiza a ordem de exibição das imagens de um imóvel
 */
export async function reorderPropertyImages(
  propertyId: string,
  orderedImages: PropertyImage[]
): Promise<void> {
  if (!isSupabaseConfigured) {
    const local = getLocalProperties();
    const idx = local.findIndex((p) => p.id === propertyId);
    if (idx === -1) return;
    local[idx].images = orderedImages.map((img, orderIdx) => ({
      ...img,
      display_order: orderIdx,
    }));
    saveLocalProperties(local);
    return;
  }

  for (let i = 0; i < orderedImages.length; i++) {
    const img = orderedImages[i];
    await supabase
      .from('property_images')
      .update({ display_order: i })
      .eq('id', img.id);
  }
}

/**
 * Utilitário opcional para o administrador popular o banco Supabase recém-criado
 * com os imóveis de demonstração de `src/data/seedExample.ts`.
 */
export async function seedDatabaseWithExamples(): Promise<number> {
  if (!isSupabaseConfigured) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_EXAMPLE_PROPERTIES));
    return SEED_EXAMPLE_PROPERTIES.length;
  }

  let insertedCount = 0;
  for (const seedProp of SEED_EXAMPLE_PROPERTIES) {
    const { images, id: _ignoreId, created_at: _c, updated_at: _u, ...propData } = seedProp;

    const { data: createdProp, error } = await supabase
      .from('properties')
      .upsert([propData], { onConflict: 'slug' })
      .select('*')
      .single();

    if (!error && createdProp) {
      insertedCount++;
      if (images && images.length > 0) {
        const imageRows = images.map((img, idx) => ({
          property_id: createdProp.id,
          image_url: img.image_url,
          storage_path: img.storage_path,
          is_cover: idx === 0,
          display_order: idx,
        }));
        await supabase.from('property_images').insert(imageRows);
      }
    }
  }
  return insertedCount;
}
