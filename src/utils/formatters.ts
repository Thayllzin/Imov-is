import { SITE_CONFIG } from '../config/siteConfig';
import { Property, PropertyPurpose, PropertyStatus, PropertyType } from '../types/property';

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'Sob consulta';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(value: number | null | undefined): string {
  if (!value || Number.isNaN(value)) return '—';
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value)} m²`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    house: 'Casa / Sobrado',
    apartment: 'Apartamento',
    penthouse: 'Cobertura',
    villa: 'Condomínio Fechado',
    land: 'Terreno / Lote',
    commercial: 'Comercial',
  };
  return labels[type] || type;
}

export function getPurposeLabel(purpose: PropertyPurpose): string {
  const labels: Record<PropertyPurpose, string> = {
    sale: 'Venda',
    rent: 'Aluguel',
    both: 'Venda ou Aluguel',
  };
  return labels[purpose] || purpose;
}

export function getStatusLabel(status: PropertyStatus): string {
  const labels: Record<PropertyStatus, string> = {
    available: 'Disponível',
    reserved: 'Reservado',
    sold: 'Vendido',
    rented: 'Alugado',
  };
  return labels[status] || status;
}

export function getCoverImageUrl(property: Property): string {
  if (property.images && property.images.length > 0) {
    const cover = property.images.find((img) => img.is_cover);
    if (cover) return cover.image_url;
    const sorted = [...property.images].sort((a, b) => a.display_order - b.display_order);
    return sorted[0].image_url;
  }
  return '';
}

export function buildWhatsAppUrl(params?: {
  propertyTitle?: string;
  propertyCode?: string;
  propertyUrl?: string;
  customMessage?: string;
}): string {
  const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/\D/g, '');
  let message =
    params?.customMessage ||
    'Olá! Gostaria de conversar com a equipe da Marcela Cardoso Imóveis sobre opções de imóveis.';

  if (params?.propertyTitle) {
    const codeSnippet = params.propertyCode
      ? `, código ${params.propertyCode.slice(0, 8).toUpperCase()}`
      : '';
    message = `Olá! Tenho interesse no imóvel ${params.propertyTitle}${codeSnippet}. Gostaria de receber mais informações.`;
    if (params.propertyUrl) {
      message += ` Link: ${params.propertyUrl}`;
    }
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
