import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRAND_VISUAL_ASSETS } from '../data/seedExample';
import { SITE_CONFIG } from '../config/siteConfig';
import { SearchBar } from './SearchBar';

export const Hero: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative bg-[#FAF8F5] pb-12">
      {/* Banner visual principal em 16:9 / full-bleed com scrim calibrado */}
      <div className="relative min-h-[540px] w-full overflow-hidden bg-[#181615] lg:min-h-[600px]">
        {!imgError ? (
          <img
            src={BRAND_VISUAL_ASSETS.heroBanner}
            alt="Residência contemporânea de alto padrão ao entardecer — Marcela Cardoso Imóveis"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#231F1C] via-[#181615] to-[#332B22]" />
        )}

        {/* Scrim de contraste para legibilidade WCAG AA */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

        {/* Conteúdo principal do Hero */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-4 pt-16 pb-28 sm:px-6 lg:px-8 lg:pt-24 lg:pb-36">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-[#E6CFA3]">
              {SITE_CONFIG.tagline} · {SITE_CONFIG.creci}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Residências Modernas Para um Futuro Extraordinário
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Descubra casas contemporâneas em condomínio fechado, apartamentos de alto padrão e
              oportunidades selecionadas para comprar, alugar ou investir com segurança.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/imoveis"
                className="inline-flex items-center gap-2 rounded-full bg-[#C8A464] px-6 py-3 text-sm font-semibold text-[#181615] transition-colors hover:bg-[#D5B475] whitespace-nowrap"
              >
                <span>Explorar Imóveis</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/imoveis?purpose=sale"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 whitespace-nowrap"
              >
                <span>Lançamentos & Exclusivos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de pesquisa sobreposta à base do Hero, fiel à referência visual */}
      <div className="relative z-20 mx-auto -mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <SearchBar variant="hero" />
      </div>
    </section>
  );
};
