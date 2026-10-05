import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Property } from '../types/property';
import {
  formatArea,
  formatCurrency,
  getCoverImageUrl,
  getPropertyTypeLabel,
  getPurposeLabel,
  getStatusLabel,
} from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [imgError, setImgError] = useState(false);
  const coverUrl = getCoverImageUrl(property);
  const detailPath = `/imovel/${property.slug || property.id}`;

  const statusColorMap: Record<Property['status'], string> = {
    available: 'bg-[#181615]/85 text-white',
    reserved: 'bg-[#B45309]/95 text-white',
    sold: 'bg-[#575049]/95 text-white',
    rented: 'bg-[#1E3A8A]/95 text-white',
  };

  return (
    <Link
      to={detailPath}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E6E1DA] bg-white transition-transform duration-150 hover:-translate-y-0.5 hover:border-[#C8A464]"
    >
      {/* Imagem Principal com aspect ratio 4:3 e object-fit: cover */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0ECE3]">
        {coverUrl && !imgError ? (
          <img
            src={coverUrl}
            alt={property.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EFEBE3] to-[#E2DBD0] p-4 text-center text-[#7D746B]">
            <Building2 className="mb-2 h-8 w-8 text-[#9E9386]" />
            <span className="text-xs font-medium">{getPropertyTypeLabel(property.property_type)}</span>
          </div>
        )}

        {/* Scrim sutil superior para legibilidade da etiqueta de status/finalidade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/45 to-transparent" />

        {/* Indicador superior discreto (Status quando diferente de available, ou Finalidade + Destaque) */}
        <div className="absolute left-3.5 top-3.5 right-3.5 flex items-center justify-between text-xs font-medium">
          <span
            className={`rounded-md px-2.5 py-1 backdrop-blur-xs ${statusColorMap[property.status]}`}
          >
            {property.status === 'available'
              ? getPurposeLabel(property.purpose)
              : getStatusLabel(property.status)}
          </span>

          {property.featured && property.status === 'available' && (
            <span className="rounded-md bg-[#C8A464] px-2.5 py-1 text-[#181615] font-semibold">
              Destaque
            </span>
          )}
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Metadados limpos sem pílulas (Zero-Pill Discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-[#7D746B]">
            <span>{getPropertyTypeLabel(property.property_type)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {property.neighborhood}, {property.city}
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 font-sans text-base font-semibold leading-snug text-[#181615] group-hover:text-[#8C6A32] transition-colors">
            {property.title}
          </h3>
        </div>

        <div className="mt-4">
          {/* Preço em numerais tabulares */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-[#181615] tabular-nums">
              {formatCurrency(property.price)}
            </span>
            {property.purpose === 'rent' && (
              <span className="text-xs text-[#6E665E]">/ mês</span>
            )}
          </div>

          {/* Linha de especificações na base do card fiel à referência Nestora */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0ECE4] pt-3 text-xs text-[#575049] tabular-nums">
            <span>
              {property.bedrooms} {property.bedrooms === 1 ? 'Quarto' : 'Quartos'}
            </span>
            <span aria-hidden="true" className="text-[#D4C8BC]">
              ·
            </span>
            <span>
              {property.bathrooms} {property.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}
            </span>
            <span aria-hidden="true" className="text-[#D4C8BC]">
              ·
            </span>
            <span>
              {property.parking_spaces} {property.parking_spaces === 1 ? 'Vaga' : 'Vagas'}
            </span>
            <span aria-hidden="true" className="text-[#D4C8BC]">
              ·
            </span>
            <span>{formatArea(property.total_area)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
