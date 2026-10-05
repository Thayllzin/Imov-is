import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/Hero';
import { PropertyGrid } from '../components/PropertyGrid';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { getFeaturedProperties } from '../services/propertyService';
import { Property } from '../types/property';
import { BRAND_VISUAL_ASSETS } from '../data/seedExample';
import { SITE_CONFIG } from '../config/siteConfig';
import { useSEO } from '../hooks/useSEO';

export const HomePage: React.FC = () => {
  useSEO({
    title: 'Imóveis de Alto Padrão para Compra e Locação',
    description:
      'Explore casas em condomínio fechado, sobrados contemporâneos e apartamentos exclusivos com a consultoria de Marcela Cardoso Imóveis.',
  });

  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storyImgError, setStoryImgError] = useState(false);

  const loadFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeaturedProperties(4);
      setFeatured(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro inesperado ao carregar imóveis em destaque.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  const propertyCategories = [
    {
      title: 'Casas & Sobrados Contemporâneos',
      subtitle: 'Projetos autorais com iluminação linear e integração gourmet',
      href: '/imoveis?property_type=house',
      image: BRAND_VISUAL_ASSETS.contemporarySobrado,
    },
    {
      title: 'Apartamentos de Alto Padrão',
      subtitle: 'Plantas amplas e vistas panorâmicas nos bairros mais nobres',
      href: '/imoveis?property_type=apartment',
      image: BRAND_VISUAL_ASSETS.penthouseLiving,
    },
    {
      title: 'Condomínios Fechados',
      subtitle: 'Segurança 24h, lazer completo e contato com a natureza',
      href: '/imoveis?property_type=villa',
      image: BRAND_VISUAL_ASSETS.modernVilla,
    },
  ];

  return (
    <div>
      {/* 1. Hero + Barra de Busca Sobreposta */}
      <Hero />

      {/* 2. Faixa de Pilares de Confiança (inspirada na referência visual) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 border-y border-[#E6E1DA] py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col">
            <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">01</span>
            <h2 className="mt-1 font-sans text-sm font-semibold text-[#181615]">
              Imóveis Verificados
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#6E665E]">
              Curadoria criteriosa com documentação analisada e fotos reais.
            </p>
          </div>
          <div className="flex flex-col">
            <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">02</span>
            <h2 className="mt-1 font-sans text-sm font-semibold text-[#181615]">
              Consultoria Especializada
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#6E665E]">
              Acompanhamento completo desde a seleção das visitas até a escritura.
            </p>
          </div>
          <div className="flex flex-col">
            <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">03</span>
            <h2 className="mt-1 font-sans text-sm font-semibold text-[#181615]">
              Negociação Segura & Transparente
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#6E665E]">
              Segurança jurídica em todas as etapas de compra, venda ou locação.
            </p>
          </div>
          <div className="flex flex-col">
            <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">04</span>
            <h2 className="mt-1 font-sans text-sm font-semibold text-[#181615]">
              Alto Potencial de Valorização
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#6E665E]">
              Imóveis posicionados nas regiões mais valorizadas e desejadas.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Imóveis em Destaque */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium tracking-wider text-[#8C6A32]">
              Acervo Selecionado
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-[#181615] sm:text-4xl">
              Imóveis Premium Para Viver Melhor
            </h2>
          </div>
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#181615] transition-colors hover:text-[#8C6A32] whitespace-nowrap"
          >
            <span>Ver Todos os Imóveis</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingState count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadFeatured} />
        ) : (
          <PropertyGrid properties={featured} columns={4} />
        )}
      </section>

      {/* 4. Seção Institucional: Por Que Marcela Cardoso */}
      <section id="institucional" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wider text-[#8C6A32]">
              Por Que {SITE_CONFIG.brandName}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-[#181615] sm:text-4xl text-balance">
              Uma Parceira Imobiliária em Quem Você Pode Confiar
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#575049]">
              Unimos profundo conhecimento do mercado imobiliário local, olhar arquitetônico apurado
              e atendimento humano para ajudar sua família ou empresa a tomar decisões patrimoniais
              com total tranquilidade.
            </p>
            <div className="mt-6">
              <Link
                to="/imoveis"
                className="inline-flex items-center gap-2 rounded-full bg-[#181615] px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#2E2A27] whitespace-nowrap"
              >
                <span>Conhecer Portfólio</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#C8A464]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            <div className="rounded-xl border border-[#E6E1DA] bg-white p-6">
              <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">01.</span>
              <h3 className="mt-2 font-sans text-base font-semibold text-[#181615]">
                Expertise no Mercado Local
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6E665E]">
                Avaliação precisa de metro quadrado, liquidez e tendências de cada condomínio e
                bairro nobre.
              </p>
            </div>
            <div className="rounded-xl border border-[#E6E1DA] bg-white p-6">
              <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">02.</span>
              <h3 className="mt-2 font-sans text-base font-semibold text-[#181615]">
                Atendimento Personalizado
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6E665E]">
                Seus objetivos guiam nossa busca: filtramos apenas imóveis que realmente fazem
                sentido para o seu estilo de vida.
              </p>
            </div>
            <div className="rounded-xl border border-[#E6E1DA] bg-white p-6">
              <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">03.</span>
              <h3 className="mt-2 font-sans text-base font-semibold text-[#181615]">
                Assessoria de Ponta a Ponta
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6E665E]">
                Suporte em simulação de crédito imobiliário, análise de certidões, contratos e
                registro.
              </p>
            </div>
            <div className="rounded-xl border border-[#E6E1DA] bg-white p-6">
              <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">04.</span>
              <h3 className="mt-2 font-sans text-base font-semibold text-[#181615]">
                Valor a Longo Prazo
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6E665E]">
                Foco em propriedades com arquitetura atemporal, plantas inteligentes e solidez
                construtiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Banner Editorial & Prova Quantitativa (Inspirado no bloco central da referência) */}
      <section className="border-y border-[#E6E1DA] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="overflow-hidden rounded-xl border border-[#E6E1DA] bg-[#F0ECE3] lg:col-span-5">
              {!storyImgError ? (
                <img
                  src={BRAND_VISUAL_ASSETS.editorialStory}
                  alt="Ambiente de estar contemporâneo — Marcela Cardoso Imóveis"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setStoryImgError(true)}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/10] w-full bg-[#E6E1DA]" />
              )}
            </div>

            <div className="lg:col-span-7">
              <p className="text-xs font-medium tracking-wider text-[#8C6A32]">
                Mais do que uma casa
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-[#181615] sm:text-4xl text-balance">
                É o Próximo Capítulo da Sua História
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#575049]">
                Seja na conquista da sua nova residência em condomínio fechado, na mudança para um
                apartamento mais amplo ou na diversificação do seu patrimônio imobiliário, estamos
                ao seu lado para encontrar um endereço que realmente pertença a você.
              </p>

              {/* Métricas com numerais tabulares */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[#F0ECE4] pt-6 sm:grid-cols-4">
                <div>
                  <span className="block font-display text-3xl font-bold text-[#181615] tabular-nums">
                    320+
                  </span>
                  <span className="mt-1 block text-xs text-[#6E665E]">
                    Famílias Atendidas (2018–2026)
                  </span>
                </div>
                <div>
                  <span className="block font-display text-3xl font-bold text-[#181615] tabular-nums">
                    R$ 180M+
                  </span>
                  <span className="mt-1 block text-xs text-[#6E665E]">
                    Em Vendas Intermediadas
                  </span>
                </div>
                <div>
                  <span className="block font-display text-3xl font-bold text-[#181615] tabular-nums">
                    8+ Anos
                  </span>
                  <span className="mt-1 block text-xs text-[#6E665E]">
                    De Experiência no Mercado
                  </span>
                </div>
                <div>
                  <span className="block font-display text-3xl font-bold text-[#181615] tabular-nums">
                    4.9 / 5.0
                  </span>
                  <span className="mt-1 block text-xs text-[#6E665E]">
                    Satisfação dos Clientes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Seção de Tipos de Imóveis */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-wider text-[#8C6A32]">
            Categorias de Imóveis
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold text-[#181615] sm:text-4xl">
            Explore Por Estilo de Moradia
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {propertyCategories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.href}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border border-[#E6E1DA] bg-[#181615] p-6"
            >
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-semibold text-white">
                  {cat.title}
                </h3>
                <p className="mt-1 text-xs text-white/80">{cat.subtitle}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#E6CFA3]">
                  <span>Ver imóveis disponíveis</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Chamada Para Contato Final (Inspirada na faixa inferior da referência) */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#181615] px-6 py-12 sm:px-12 sm:py-14">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl text-balance">
                Pronto Para Encontrar Seu Imóvel Ideal?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Converse diretamente com Marcela Cardoso para receber uma seleção personalizada de
                imóveis ou anunciar sua propriedade com exclusividade.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppButton
                label="Solicitar Consultoria Gratuita"
                variant="gold"
                customMessage="Olá, Marcela Cardoso! Gostaria de receber uma consultoria personalizada para escolher um imóvel."
              />
              <Link
                to="/imoveis"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 whitespace-nowrap"
              >
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
