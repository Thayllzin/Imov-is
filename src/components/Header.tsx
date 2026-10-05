import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import { buildWhatsAppUrl } from '../utils/formatters';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const whatsappHref = buildWhatsAppUrl({
    customMessage:
      'Olá, Marcela Cardoso! Gostaria de agendar um atendimento para conhecer imóveis disponíveis.',
  });

  const isActive = (path: string, searchParam?: string) => {
    if (searchParam) {
      return location.pathname === path && location.search.includes(searchParam);
    }
    return location.pathname === path && !location.search;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#E6E1DA] bg-[#FAF8F5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark (Top Bar Contract) */}
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight text-[#181615] whitespace-nowrap"
        >
          {SITE_CONFIG.brandName}
        </Link>

        {/* Zone 2: 5 clean text navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#575049]"
        >
          <Link
            to="/"
            className={`transition-colors hover:text-[#181615] whitespace-nowrap ${
              isActive('/') ? 'text-[#181615] underline underline-offset-8 decoration-[#C8A464]' : ''
            }`}
          >
            Início
          </Link>
          <Link
            to="/imoveis"
            className={`transition-colors hover:text-[#181615] whitespace-nowrap ${
              isActive('/imoveis')
                ? 'text-[#181615] underline underline-offset-8 decoration-[#C8A464]'
                : ''
            }`}
          >
            Imóveis
          </Link>
          <Link
            to="/imoveis?purpose=sale"
            className={`transition-colors hover:text-[#181615] whitespace-nowrap ${
              isActive('/imoveis', 'purpose=sale')
                ? 'text-[#181615] underline underline-offset-8 decoration-[#C8A464]'
                : ''
            }`}
          >
            Comprar
          </Link>
          <Link
            to="/imoveis?purpose=rent"
            className={`transition-colors hover:text-[#181615] whitespace-nowrap ${
              isActive('/imoveis', 'purpose=rent')
                ? 'text-[#181615] underline underline-offset-8 decoration-[#C8A464]'
                : ''
            }`}
          >
            Alugar
          </Link>
          <a
            href="/#institucional"
            className="transition-colors hover:text-[#181615] whitespace-nowrap"
          >
            Sobre
          </a>
        </nav>

        {/* Zone 3: Primary action + Mobile menu button */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#181615] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2E2A27] whitespace-nowrap shrink-0"
          >
            <span>Agendar Atendimento</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#C8A464]" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#DED8CE] text-[#181615] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#E6E1DA] bg-[#FAF8F5] px-4 pt-3 pb-6 md:hidden">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#3B3632]">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-[#F0ECE3]"
            >
              Início
            </Link>
            <Link
              to="/imoveis"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-[#F0ECE3]"
            >
              Todos os Imóveis
            </Link>
            <Link
              to="/imoveis?purpose=sale"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-[#F0ECE3]"
            >
              Imóveis à Venda
            </Link>
            <Link
              to="/imoveis?purpose=rent"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-[#F0ECE3]"
            >
              Imóveis para Alugar
            </Link>
            <a
              href="/#institucional"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-[#F0ECE3]"
            >
              Sobre Marcela Cardoso
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-xs text-[#6E665E] hover:bg-[#F0ECE3]"
            >
              Área Administrativa
            </Link>
            <div className="pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#181615] px-4 py-3 text-xs font-medium text-white"
              >
                <span>Agendar Atendimento pelo WhatsApp</span>
                <ArrowUpRight className="h-4 w-4 text-[#C8A464]" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
