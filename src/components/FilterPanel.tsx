import React from 'react';
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { PropertyFilters, PropertyPurpose, PropertyType } from '../types/property';

interface FilterPanelProps {
  filters: PropertyFilters;
  onChange: (updated: PropertyFilters) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  onReset,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const updateField = <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const content = (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#8C6A32]" />
          <h2 className="font-sans text-sm font-semibold text-[#181615]">Filtrar Imóveis</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#6E665E] transition-colors hover:text-[#181615] whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Limpar</span>
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Fechar filtros"
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6E1DA] text-[#181615] lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Finalidade (Venda / Aluguel) */}
      <div>
        <label className="mb-2 block text-xs font-semibold text-[#181615]">Finalidade</label>
        <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-[#F3EFE8] p-1">
          {[
            { value: '', label: 'Todos' },
            { value: 'sale', label: 'Comprar' },
            { value: 'rent', label: 'Alugar' },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => updateField('purpose', option.value as PropertyPurpose | '')}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                (filters.purpose || '') === option.value
                  ? 'bg-white text-[#181615] shadow-xs font-semibold'
                  : 'text-[#6E665E] hover:text-[#181615]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Imóvel */}
      <div>
        <label
          htmlFor="filter-property-type"
          className="mb-1.5 block text-xs font-semibold text-[#181615]"
        >
          Tipo de Imóvel
        </label>
        <select
          id="filter-property-type"
          value={filters.property_type || ''}
          onChange={(e) => updateField('property_type', e.target.value as PropertyType | '')}
          className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
        >
          <option value="">Todos os tipos</option>
          <option value="house">Casa / Sobrado</option>
          <option value="apartment">Apartamento</option>
          <option value="villa">Condomínio Fechado</option>
          <option value="penthouse">Cobertura</option>
          <option value="land">Terreno / Lote</option>
          <option value="commercial">Comercial</option>
        </select>
      </div>

      {/* Cidade e Bairro */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label
            htmlFor="filter-city"
            className="mb-1.5 block text-xs font-semibold text-[#181615]"
          >
            Cidade
          </label>
          <input
            id="filter-city"
            type="text"
            value={filters.city || ''}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="Ex: Belém"
            className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="filter-neighborhood"
            className="mb-1.5 block text-xs font-semibold text-[#181615]"
          >
            Bairro
          </label>
          <input
            id="filter-neighborhood"
            type="text"
            value={filters.neighborhood || ''}
            onChange={(e) => updateField('neighborhood', e.target.value)}
            placeholder="Ex: Umarizal, Nazaré, Parque Verde"
            className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Preço Mínimo e Preço Máximo */}
      <div>
        <span className="mb-1.5 block text-xs font-semibold text-[#181615]">
          Faixa de Preço (R$)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="filter-min-price" className="sr-only">
              Preço Mínimo
            </label>
            <input
              id="filter-min-price"
              type="number"
              min={0}
              value={filters.min_price ?? ''}
              onChange={(e) =>
                updateField('min_price', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="Mínimo"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="sr-only">
              Preço Máximo
            </label>
            <input
              id="filter-max-price"
              type="number"
              min={0}
              value={filters.max_price ?? ''}
              onChange={(e) =>
                updateField('max_price', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="Máximo"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Quartos */}
      <div>
        <span className="mb-1.5 block text-xs font-semibold text-[#181615]">
          Quantidade de Quartos (mínimo)
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { label: 'Todos', val: '' },
            { label: '1+', val: 1 },
            { label: '2+', val: 2 },
            { label: '3+', val: 3 },
            { label: '4+', val: 4 },
          ].map((item) => (
            <button
              key={String(item.label)}
              type="button"
              onClick={() => updateField('bedrooms', item.val as number | '')}
              className={`rounded-lg border py-1.5 text-xs font-medium transition-colors tabular-nums ${
                (filters.bedrooms ?? '') === item.val
                  ? 'border-[#181615] bg-[#181615] text-white'
                  : 'border-[#DED8CE] bg-[#FAF8F5] text-[#575049] hover:border-[#181615]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Banheiros */}
      <div>
        <span className="mb-1.5 block text-xs font-semibold text-[#181615]">
          Quantidade de Banheiros (mínimo)
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { label: 'Todos', val: '' },
            { label: '1+', val: 1 },
            { label: '2+', val: 2 },
            { label: '3+', val: 3 },
            { label: '4+', val: 4 },
          ].map((item) => (
            <button
              key={String(item.label)}
              type="button"
              onClick={() => updateField('bathrooms', item.val as number | '')}
              className={`rounded-lg border py-1.5 text-xs font-medium transition-colors tabular-nums ${
                (filters.bathrooms ?? '') === item.val
                  ? 'border-[#181615] bg-[#181615] text-white'
                  : 'border-[#DED8CE] bg-[#FAF8F5] text-[#575049] hover:border-[#181615]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metragem Mínima e Máxima */}
      <div>
        <span className="mb-1.5 block text-xs font-semibold text-[#181615]">
          Área Total (m²)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="filter-min-area" className="sr-only">
              Área Mínima
            </label>
            <input
              id="filter-min-area"
              type="number"
              min={0}
              value={filters.min_area ?? ''}
              onChange={(e) =>
                updateField('min_area', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="Mín. m²"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="filter-max-area" className="sr-only">
              Área Máxima
            </label>
            <input
              id="filter-max-area"
              type="number"
              min={0}
              value={filters.max_area ?? ''}
              onChange={(e) =>
                updateField('max_area', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="Máx. m²"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* Status na busca pública */}
      <div>
        <label
          htmlFor="filter-public-status"
          className="mb-1.5 block text-xs font-semibold text-[#181615]"
        >
          Disponibilidade
        </label>
        <select
          id="filter-public-status"
          value={filters.status || 'all_public'}
          onChange={(e) => updateField('status', e.target.value as PropertyFilters['status'])}
          className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
        >
          <option value="all_public">Todos do catálogo</option>
          <option value="available">Apenas Disponíveis</option>
          <option value="reserved">Reservados</option>
          <option value="sold">Vendidos</option>
          <option value="rented">Alugados</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Painel Desktop */}
      <aside className="hidden lg:block rounded-xl border border-[#E6E1DA] bg-white p-5">
        {content}
      </aside>

      {/* Drawer Mobile */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white p-5 shadow-xl">
            {content}
            <div className="mt-6 pt-4 border-t border-[#E6E1DA]">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full rounded-lg bg-[#181615] py-3 text-sm font-medium text-white"
              >
                Ver Imóveis Filtrados
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
