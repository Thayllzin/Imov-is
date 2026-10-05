export type PropertyStatus = 'available' | 'sold' | 'rented' | 'reserved';

export type PropertyPurpose = 'sale' | 'rent' | 'both';

export type PropertyType =
  | 'house'
  | 'apartment'
  | 'penthouse'
  | 'villa'
  | 'land'
  | 'commercial';

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  storage_path: string;
  is_cover: boolean;
  display_order: number;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  property_type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  condominium_fee: number | null;
  iptu: number | null;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking_spaces: number;
  total_area: number;
  built_area: number | null;
  status: PropertyStatus;
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
  features: string[];
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
}

export interface PropertyFormData {
  title: string;
  slug: string;
  description: string;
  property_type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  condominium_fee: number;
  iptu: number;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking_spaces: number;
  total_area: number;
  built_area: number;
  status: PropertyStatus;
  featured: boolean;
  latitude: string;
  longitude: string;
  features: string[];
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'area_desc';

export interface PropertyFilters {
  search?: string;
  property_type?: PropertyType | '';
  purpose?: PropertyPurpose | '';
  min_price?: number | '';
  max_price?: number | '';
  city?: string;
  neighborhood?: string;
  bedrooms?: number | '';
  bathrooms?: number | '';
  min_area?: number | '';
  max_area?: number | '';
  status?: PropertyStatus | 'all_public' | 'all_admin';
  include_inactive_public?: boolean;
  sort?: SortOption;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  created_at?: string;
}

export interface AdminStats {
  total: number;
  available: number;
  sold: number;
  rented: number;
  reserved: number;
  featured: number;
}
