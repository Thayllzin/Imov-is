import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../config/siteConfig';
import { buildWhatsAppUrl } from '../utils/formatters';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E6E1DA] bg-[#FAF8F5] text-[#4A443E]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Coluna 1: Marca e posicionamento */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="font-display text-2xl font-semibold tracking-tight text-[#181615]"
            >
              {SITE_CONFIG.brandFullTitle}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6E665E]">
              Curadoria imobiliária dedicada a residências contemporâneas, apartamentos de alto
              padrão e investimentos seguros com atendimento personalizado.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#7D746B]">
              <span>{SITE_CONFIG.creci}</span>
              <span aria-hidden="true">·</span>
              <span>Atendimento Exclusivo</span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold tracking-wider text-[#181615]">Navegação</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6E665E]">
              <li>
                <Link to="/" className="transition-colors hover:text-[#181615]">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/imoveis" className="transition-colors hover:text-[#181615]">
                  Catálogo de Imóveis
                </Link>
              </li>
              <li>
                <Link
                  to="/imoveis?purpose=sale"
                  className="transition-colors hover:text-[#181615]"
                >
                  Comprar Imóvel
                </Link>
              </li>
              <li>
                <Link
                  to="/imoveis?purpose=rent"
                  className="transition-colors hover:text-[#181615]"
                >
                  Alugar Imóvel
                </Link>
              </li>
              <li>
                <a href="/#institucional" className="transition-colors hover:text-[#181615]">
                  Nossa História
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Tipos de Imóveis */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#181615]">
              Categorias de Imóveis
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[#6E665E]">
              <li>
                <Link
                  to="/imoveis?property_type=house"
                  className="transition-colors hover:text-[#181615]"
                >
                  Casas e Sobrados Contemporâneos
                </Link>
              </li>
              <li>
                <Link
                  to="/imoveis?property_type=apartment"
                  className="transition-colors hover:text-[#181615]"
                >
                  Apartamentos de Alto Padrão
                </Link>
              </li>
              <li>
                <Link
                  to="/imoveis?property_type=villa"
                  className="transition-colors hover:text-[#181615]"
                >
                  Condomínios Fechados
                </Link>
              </li>
              <li>
                <Link
                  to="/imoveis?property_type=penthouse"
                  className="transition-colors hover:text-[#181615]"
                >
                  Coberturas e Duplex
                </Link>
              </li>
              <li>
                <Link
                  to="/imoveis?property_type=commercial"
                  className="transition-colors hover:text-[#181615]"
                >
                  Salas e Imóveis Comerciais
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato Direto */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#181615]">
              Contato & Escritório
            </h3>
            <div className="mt-4 space-y-2.5 text-sm text-[#6E665E]">
              <p>{SITE_CONFIG.address}</p>
              <p className="tabular-nums font-medium text-[#181615]">
                {SITE_CONFIG.phoneDisplay}
              </p>
              <p>{SITE_CONFIG.email}</p>
              <p className="text-xs text-[#8A8077]">{SITE_CONFIG.businessHours}</p>
              <div className="pt-2">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-[#8C6A32] underline underline-offset-4 hover:text-[#181615]"
                >
                  Iniciar conversa no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E6E1DA] pt-6 text-xs text-[#7D746B] sm:flex-row">
          <p>
            © {currentYear} {SITE_CONFIG.brandFullTitle}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/imoveis" className="hover:text-[#181615]">
              Imóveis
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-[#181615]">
              Acesso Administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
