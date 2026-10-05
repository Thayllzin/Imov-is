import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { FilterPanel } from '../components/FilterPanel';
import { PropertyGrid } from '../components/PropertyGrid';
import { SearchBar } from '../components/SearchBar';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { getProperties } from '../services/propertyService';
import {
  Property,
  PropertyFilters,
  PropertyPurpose,
  PropertyType,
  SortOption,
} from '../types/property';
import { useSEO } from '../hooks/useSEO';

const PAGE_SIZE = 9;

export const PropertiesPage: React.FC = () => {
  useSEO({
    title: 'Catálogo de Imóveis à Venda e Aluguel',
    description:
      'Pesquise e filtre casas, sobrados, apartamentos e coberturas por bairro, número de quartos, metragem e faixa de preço.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    search: searchParams.get('search') || '',
    purpose: (searchParams.get('purpose') as PropertyPurpose) || '',
    property_type: (searchParams.get('property_type') as PropertyType) || '',
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : '',
    min_price: '',
    city: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    min_area: '',
    max_area: '',
    status: 'all_public',
    sort: 'newest',
  }));

  const [properties, setProperties] = useState<Property[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza quando a URL muda (ex: clicando nos links do Header "Comprar" / "Alugar")
  useEffect(() => {
    const urlPurpose = (searchParams.get('purpose') as PropertyPurpose) || '';
    const urlType = (searchParams.get('property_type') as PropertyType) || '';
    const urlSearch = searchParams.get('search') || '';
    const urlMaxPrice = searchParams.get('max_price')
      ? Number(searchParams.get('max_price'))
      : '';

    setFilters((prev) => ({
      ...prev,
      purpose: urlPurpose,
      property_type: urlType,
      search: urlSearch,
      max_price: urlMaxPrice,
    }));
  }, [searchParams]);

  const fetchList = async (activeFilters: PropertyFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProperties(activeFilters);
      setProperties(data);
      setVisibleCount(PAGE_SIZE);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao consultar catálogo de imóveis.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(filters);
  }, [filters]);

  const handleResetFilters = () => {
    setSearchParams({});
    setFilters({
      search: '',
      purpose: '',
      property_type: '',
      min_price: '',
      max_price: '',
      city: '',
      neighborhood: '',
      bedrooms: '',
      bathrooms: '',
      min_area: '',
      max_area: '',
      status: 'all_public',
      sort: 'newest',
    });
  };

  const visibleProperties = properties.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Cabeçalho da Página de Listagem */}
      <div className="border-b border-[#E6E1DA] pb-6">
        <p className="text-xs font-medium tracking-wider text-[#8C6A32]">
          Portfólio Imobiliário
        </p>
        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#181615] sm:text-4xl">
              Imóveis Disponíveis
            </h1>
            <p className="mt-1 text-sm text-[#6E665E] tabular-nums">
              {loading
                ? 'Consultando imóveis...'
                : `${properties.length} ${
                    properties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'
                  }`}
            </p>
          </div>

          {/* Barra de Ordenação e Botão Mobile de Filtros */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#DED8CE] bg-white px-4 py-2 text-xs font-semibold text-[#181615] lg:hidden whitespace-nowrap"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#8C6A32]" />
              <span>Filtros Avançados</span>
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-medium text-[#6E665E]">
                Ordenar por:
              </label>
              <select
                id="sort-select"
                value={filters.sort || 'newest'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort: e.target.value as SortOption,
                  }))
                }
                className="rounded-lg border border-[#DED8CE] bg-white px-3 py-2 text-xs font-medium text-[#181615] focus:border-[#C8A464] focus:outline-none"
              >
                <option value="newest">Mais recentes</option>
                <option value="price_asc">Menor valor</option>
                <option value="price_desc">Maior valor</option>
                <option value="area_desc">Maior metragem</option>
              </select>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Textual */}
        <div className="mt-5">
          <SearchBar
            variant="compact"
            initialSearch={filters.search || ''}
            onSearch={({ search }) =>
              setFilters((prev) => ({
                ...prev,
                search,
              }))
            }
          />
        </div>
      </div>

      {/* Layout Principal: Filtros à esquerda (Desktop) + Grid à direita */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            isOpenMobile={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />
        </div>

        <div className="lg:col-span-9">
          {loading ? (
            <LoadingState count={6} />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchList(filters)} />
          ) : (
            <>
              <PropertyGrid
                properties={visibleProperties}
                columns={3}
                onResetFilters={handleResetFilters}
              />

              {/* Paginação / Carregamento Progressivo */}
              {visibleCount < properties.length && (
                <div className="mt-10 flex flex-col items-center justify-center gap-2">
                  <p className="text-xs text-[#6E665E] tabular-nums">
                    Exibindo {visibleProperties.length} de {properties.length} imóveis
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="rounded-lg border border-[#181615] bg-white px-6 py-2.5 text-xs font-semibold text-[#181615] transition-colors hover:bg-[#181615] hover:text-white whitespace-nowrap"
                  >
                    Carregar mais imóveis
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
