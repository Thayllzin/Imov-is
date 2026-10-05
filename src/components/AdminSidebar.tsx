import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SITE_CONFIG } from '../config/siteConfig';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Visão Geral',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Gerenciar Imóveis',
      path: '/admin/imoveis',
      icon: Building2,
      exact: true,
    },
    {
      label: 'Novo Imóvel',
      path: '/admin/imoveis/novo',
      icon: PlusCircle,
      exact: true,
    },
  ];

  return (
    <aside className="flex w-full flex-col justify-between border-b border-[#E6E1DA] bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:min-h-screen">
      <div>
        <div className="border-b border-[#E6E1DA] px-6 py-5">
          <Link
            to="/admin"
            className="font-display text-xl font-semibold tracking-tight text-[#181615]"
          >
            {SITE_CONFIG.brandName}
          </Link>
          <p className="mt-0.5 text-xs text-[#7D746B]">Painel Administrativo</p>
        </div>

        <nav className="flex flex-row gap-1 overflow-x-auto p-3 lg:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#181615] text-white'
                    : 'text-[#575049] hover:bg-[#FAF8F5] hover:text-[#181615]'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-[#C8A464]' : 'text-[#8C8277]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#E6E1DA] p-4 space-y-3">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border border-[#E6E1DA] bg-[#FAF8F5] px-3.5 py-2 text-xs font-medium text-[#181615] transition-colors hover:border-[#C8A464]"
        >
          <span>Ver Site Público</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#8C6A32]" />
        </Link>

        {user && (
          <div className="px-1 text-xs text-[#7D746B] truncate" title={user.email}>
            Logado como: <span className="font-medium text-[#181615]">{user.email}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium text-[#B42318] transition-colors hover:bg-[#FDF2F2]"
        >
          <LogOut className="h-4 w-4" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
};
