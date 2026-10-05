import React, { useState } from 'react';
import { Share2, Check, ExternalLink } from 'lucide-react';
import { Property } from '../types/property';
import {
  formatArea,
  formatCurrency,
  getPropertyTypeLabel,
  getPurposeLabel,
  getStatusLabel,
} from '../utils/formatters';
import { PropertyFeatures } from './PropertyFeatures';
import { WhatsAppButton } from './WhatsAppButton';

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Confira este imóvel em ${property.neighborhood}, ${property.city}: ${property.title}`,
          url: currentUrl,
        });
        return;
      } catch {
        // fallback para copiar link
      }
    }

    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const hasCoordinates =
    property.latitude !== null &&
    property.latitude !== undefined &&
    property.longitude !== null &&
    property.longitude !== undefined &&
    !Number.isNaN(Number(property.latitude)) &&
    !Number.isNaN(Number(property.longitude));

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Coluna Principal (Especificações, Descrição, Diferenciais e Mapa) */}
      <div className="space-y-8 lg:col-span-8">
        {/* Cabeçalho do Imóvel */}
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7D746B]">
            <span>{getPropertyTypeLabel(property.property_type)}</span>
            <span aria-hidden="true">·</span>
            <span>{getPurposeLabel(property.purpose)}</span>
            <span aria-hidden="true">·</span>
            <span>{getStatusLabel(property.status)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              Cód. {property.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#181615] sm:text-4xl text-balance">
            {property.title}
          </h1>

          <p className="mt-2 text-sm text-[#575049]">
            {property.address ? `${property.address} — ` : ''}
            {property.neighborhood}, {property.city} - {property.state}
          </p>
        </div>

        {/* Quadro de Métricas Principais (Tabular Numerals) */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#E6E1DA] bg-white p-5 sm:grid-cols-3 md:grid-cols-6">
          <div>
            <span className="block text-xs text-[#7D746B]">Quartos</span>
            <span className="mt-1 block text-lg font-semibold text-[#181615] tabular-nums">
              {property.bedrooms}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#7D746B]">Suítes</span>
            <span className="mt-1 block text-lg font-semibold text-[#181615] tabular-nums">
              {property.suites}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#7D746B]">Banheiros</span>
            <span className="mt-1 block text-lg font-semibold text-[#181615] tabular-nums">
              {property.bathrooms}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#7D746B]">Vagas</span>
            <span className="mt-1 block text-lg font-semibold text-[#181615] tabular-nums">
              {property.parking_spaces}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#7D746B]">Área Total</span>
            <span className="mt-1 block text-lg font-semibold text-[#181615] tabular-nums">
              {formatArea(property.total_area)}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#7D746B]">Área Construída</span>
            <span className="mt-1 block text-lg font-semibold text-[#181615] tabular-nums">
              {formatArea(property.built_area)}
            </span>
          </div>
        </div>

        {/* Descrição Editorial */}
        <section className="border-t border-[#E6E1DA] pt-8">
          <h2 className="font-display text-2xl font-semibold text-[#181615]">
            Sobre o Imóvel
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-[#3B3632] whitespace-pre-line">
            {property.description || 'Entre em contato para receber o memorial descritivo completo deste imóvel.'}
          </div>
        </section>

        {/* Características / Diferenciais */}
        <PropertyFeatures features={property.features} />

        {/* Seção de Mapa — exibida apenas quando houver latitude e longitude */}
        {hasCoordinates && (
          <section className="border-t border-[#E6E1DA] pt-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#181615]">
                  Localização
                </h2>
                <p className="mt-1 text-sm text-[#6E665E]">
                  {property.address ? `${property.address}, ` : ''}
                  {property.neighborhood} — {property.city}/{property.state}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6A32] hover:text-[#181615]"
              >
                <span>Abrir no Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[#E6E1DA] bg-[#F0ECE3]">
              <iframe
                title={`Mapa de localização — ${property.title}`}
                width="100%"
                height="320"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  Number(property.longitude) - 0.008
                }%2C${Number(property.latitude) - 0.006}%2C${
                  Number(property.longitude) + 0.008
                }%2C${Number(property.latitude) + 0.006}&layer=mapnik&marker=${
                  property.latitude
                }%2C${property.longitude}`}
                className="w-full border-0"
              />
            </div>
          </section>
        )}
      </div>

      {/* Coluna Lateral Contígua de Contato e Valores (Sticky no Desktop) */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 rounded-xl border border-[#E6E1DA] bg-white p-6">
          <div className="border-b border-[#F0ECE4] pb-5">
            <span className="text-xs font-medium text-[#7D746B]">
              Valor de {getPurposeLabel(property.purpose)}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#181615] tabular-nums">
                {formatCurrency(property.price)}
              </span>
              {property.purpose === 'rent' && (
                <span className="text-xs text-[#6E665E]">/ mês</span>
              )}
            </div>

            {/* Condomínio e IPTU */}
            <div className="mt-4 space-y-2 text-xs text-[#575049]">
              <div className="flex items-center justify-between">
                <span>Condomínio</span>
                <span className="font-medium text-[#181615] tabular-nums">
                  {property.condominium_fee
                    ? `${formatCurrency(property.condominium_fee)} / mês`
                    : 'Não informado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>IPTU</span>
                <span className="font-medium text-[#181615] tabular-nums">
                  {property.iptu ? formatCurrency(property.iptu) : 'Não informado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status atual</span>
                <span className="font-semibold text-[#181615]">
                  {getStatusLabel(property.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Ações Principais: WhatsApp + Compartilhar */}
          <div className="mt-6 space-y-3">
            <WhatsAppButton
              propertyTitle={property.title}
              propertyCode={property.id}
              propertyUrl={currentUrl}
              label="Tenho interesse"
              variant="gold"
              className="w-full py-3.5"
            />

            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#D8D1C7] bg-white px-4 py-3 text-sm font-medium text-[#181615] transition-colors hover:bg-[#FAF8F5] whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#15803D]" />
                  <span>Link copiado para a área de transferência</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 text-[#6E665E]" />
                  <span>Compartilhar este imóvel</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 rounded-lg bg-[#FAF8F5] p-4 text-xs leading-relaxed text-[#6E665E]">
            <p className="font-semibold text-[#181615]">Atendimento Especializado</p>
            <p className="mt-1">
              Receba informações completas, agende uma visita presencial ou solicite simulação de
              financiamento diretamente com Marcela Cardoso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
