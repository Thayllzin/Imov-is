import { PropertyStatus } from '../types/property';

/**
 * CONFIGURAÇÃO CENTRALIZADA DO SISTEMA IMOBILIÁRIO
 * Altere aqui o número do WhatsApp, informações da corretora/imobiliária
 * e quais status de imóveis aparecem na busca pública.
 */

export const SITE_CONFIG = {
  brandName: 'Marcela Cardoso',
  brandFullTitle: 'Marcela Cardoso Imóveis',
  creci: 'CRECI-PA 12.529',
  tagline: 'Consultoria Imobiliária de Alto Padrão',
  /**
   * Número do WhatsApp centralizado (Código do País + DDD + Número, apenas dígitos).
   * Pode ser sobrescrito pela variável de ambiente VITE_WHATSAPP_NUMBER na Vercel.
   */
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '559182509618',
  phoneDisplay: '+55 91 8250-9618',
  email: 'contato@marcelacardosoimoveis.com.br',
  address: 'Av. Braz de Aguiar, 612 — Nazaré, Belém - PA',
  businessHours: 'Seg a Sex: 08h30 às 18h30 · Sáb: 09h às 13h',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
  },
  /**
   * Configuração de quais status aparecem por padrão na listagem pública.
   * No site público:
   * - available -> mostra normalmente
   * - reserved  -> mostra selo "Reservado"
   * - sold      -> mostra selo "Vendido"
   * - rented    -> mostra selo "Alugado"
   */
  defaultPublicStatuses: ['available', 'reserved', 'sold', 'rented'] as PropertyStatus[],
};
