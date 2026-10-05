import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PropertyGallery } from '../components/PropertyGallery';
import { PropertyDetails } from '../components/PropertyDetails';
import { PropertyGrid } from '../components/PropertyGrid';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import {
  getPropertyBySlugOrId,
  getSimilarProperties,
} from '../services/propertyService';
import { Property } from '../types/property';
import { getCoverImageUrl } from '../utils/formatters';
import { useSEO } from '../hooks/useSEO';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: property
      ? `${property.title} — ${property.neighborhood}, ${property.city}`
      : 'Detalhes do Imóvel',
    description: property
      ? property.description.slice(0, 155)
      : 'Consulte fotos, preço, localização e ficha técnica completa do imóvel.',
    image: property ? getCoverImageUrl(property) : undefined,
    jsonLd: property
      ? {
          '@context': 'https://schema.org',
          '@type': 'SingleFamilyResidence',
          name: property.title,
          description: property.description,
          numberOfRooms: property.bedrooms,
          address: {
            '@type': 'PostalAddress',
            addressLocality: property.city,
            addressRegion: property.state,
            streetAddress: `${property.neighborhood} ${property.address || ''}`.trim(),
          },
        }
      : undefined,
  });

  const loadDetail = async (slugOrId: string) => {
    setLoading(true);
    setError(null);
    try {
      const found = await getPropertyBySlugOrId(slugOrId);
      setProperty(found);
      if (found) {
        const sim = await getSimilarProperties(found, 3);
        setSimilar(sim);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar informações do imóvel.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      loadDetail(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <LoadingState message="Carregando galeria e informações do imóvel..." count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={() => id && loadDetail(id)} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Imóvel não encontrado"
          description="O imóvel que você procura pode ter sido removido ou teve seu endereço atualizado."
        />
        <div className="mt-6 text-center">
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#181615] hover:text-[#8C6A32]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para a listagem de imóveis</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Navegação Superior / Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/imoveis"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#575049] transition-colors hover:text-[#181615]"
        >
          <ArrowLeft className="h-4 w-4 text-[#8C6A32]" />
          <span>Voltar para Todos os Imóveis</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-[#7D746B]">
          <Link to="/" className="hover:text-[#181615]">
            Início
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/imoveis" className="hover:text-[#181615]">
            Imóveis
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate max-w-[200px] text-[#181615]">{property.title}</span>
        </div>
      </div>

      {/* Galeria de Fotos (Com Lightbox no clique) */}
      <PropertyGallery images={property.images || []} title={property.title} />

      {/* Detalhes, Valores, Características, Mapa e Contato */}
      <div className="mt-10">
        <PropertyDetails property={property} />
      </div>

      {/* Imóveis Semelhantes */}
      {similar.length > 0 && (
        <section className="mt-16 border-t border-[#E6E1DA] pt-12">
          <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium tracking-wider text-[#8C6A32]">
                Sugestões Relacionadas
              </p>
              <h2 className="mt-1 font-display text-3xl font-semibold text-[#181615]">
                Imóveis Semelhantes
              </h2>
            </div>
            <Link
              to="/imoveis"
              className="text-xs font-semibold text-[#181615] hover:text-[#8C6A32]"
            >
              Ver catálogo completo
            </Link>
          </div>
          <PropertyGrid properties={similar} columns={3} />
        </section>
      )}
    </div>
  );
};
