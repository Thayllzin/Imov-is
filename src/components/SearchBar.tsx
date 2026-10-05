import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PropertyPurpose, PropertyType } from '../types/property';

interface SearchBarProps {
  initialSearch?: string;
  initialPurpose?: PropertyPurpose | '';
  initialType?: PropertyType | '';
  initialMaxPrice?: string;
  variant?: 'hero' | 'compact';
  onSearch?: (params: {
    search: string;
    purpose: PropertyPurpose | '';
    property_type: PropertyType | '';
    max_price: string;
  }) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialSearch = '',
  initialPurpose = '',
  initialType = '',
  initialMaxPrice = '',
  variant = 'hero',
  onSearch,
}) => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<PropertyPurpose | ''>(initialPurpose);
  const [search, setSearch] = useState(initialSearch);
  const [propertyType, setPropertyType] = useState<PropertyType | ''>(initialType);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        search,
        purpose,
        property_type: propertyType,
        max_price: maxPrice,
      });
      return;
    }

    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (purpose) params.set('purpose', purpose);
    if (propertyType) params.set('property_type', propertyType);
    if (maxPrice) params.set('max_price', maxPrice);

    navigate(`/imoveis?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-[#E6E1DA] bg-white p-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8277]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por título, bairro, cidade ou código..."
            className="w-full rounded-lg border border-transparent bg-[#FAF8F5] py-2.5 pl-10 pr-4 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#181615] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2E2A27] whitespace-nowrap"
        >
          <Search className="h-4 w-4 text-[#C8A464]" />
          <span>Pesquisar</span>
        </button>
      </form>
    );
  }

  return (
    <div className="w-full">
      {/* Abas superiores inspiradas na referência visual */}
      <div className="inline-flex rounded-t-xl bg-white/95 p-1.5 backdrop-blur-md border-t border-x border-[#E6E1DA]">
        <button
          type="button"
          onClick={() => setPurpose('sale')}
          className={`rounded-lg px-5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
            purpose === 'sale'
              ? 'bg-[#181615] text-white'
              : 'text-[#575049] hover:text-[#181615]'
          }`}
        >
          Comprar
        </button>
        <button
          type="button"
          onClick={() => setPurpose('rent')}
          className={`rounded-lg px-5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
            purpose === 'rent'
              ? 'bg-[#181615] text-white'
              : 'text-[#575049] hover:text-[#181615]'
          }`}
        >
          Alugar
        </button>
        <button
          type="button"
          onClick={() => setPurpose('')}
          className={`rounded-lg px-5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
            purpose === ''
              ? 'bg-[#181615] text-white'
              : 'text-[#575049] hover:text-[#181615]'
          }`}
        >
          Todos
        </button>
      </div>

      {/* Painel principal de busca */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-b-xl rounded-tr-xl border border-[#E6E1DA] bg-white p-5 shadow-sm md:grid-cols-12 md:items-end"
      >
        <div className="md:col-span-4">
          <label
            htmlFor="hero-search-location"
            className="mb-1.5 block text-xs font-semibold text-[#181615]"
          >
            Localização ou Empreendimento
          </label>
          <input
            id="hero-search-location"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cidade, bairro (ex: Umarizal, Nazaré)..."
            className="w-full rounded-lg border border-[#E2DCD3] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] placeholder-[#8C8277] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <label
            htmlFor="hero-search-type"
            className="mb-1.5 block text-xs font-semibold text-[#181615]"
          >
            Tipo de Imóvel
          </label>
          <select
            id="hero-search-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as PropertyType | '')}
            className="w-full rounded-lg border border-[#E2DCD3] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
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

        <div className="md:col-span-3">
          <label
            htmlFor="hero-search-budget"
            className="mb-1.5 block text-xs font-semibold text-[#181615]"
          >
            Faixa de Valor
          </label>
          <select
            id="hero-search-budget"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-[#E2DCD3] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none tabular-nums"
          >
            <option value="">Qualquer valor</option>
            <option value="25000">Até R$ 25.000 (Locação)</option>
            <option value="800000">Até R$ 800.000</option>
            <option value="1500000">Até R$ 1.500.000</option>
            <option value="2500000">Até R$ 2.500.000</option>
            <option value="4000000">Até R$ 4.000.000</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#C8A464] px-4 py-2.5 text-sm font-semibold text-[#181615] transition-colors hover:bg-[#B89352] whitespace-nowrap"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Buscar Imóveis</span>
          </button>
        </div>
      </form>
    </div>
  );
};
