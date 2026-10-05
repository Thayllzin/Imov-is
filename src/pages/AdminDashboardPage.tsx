import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowRight, Database, Edit3, ExternalLink } from 'lucide-react';
import {
  getAdminStats,
  getProperties,
  seedDatabaseWithExamples,
  updatePropertyStatus,
} from '../services/propertyService';
import { AdminStats, Property, PropertyStatus } from '../types/property';
import {
  formatCurrency,
  getCoverImageUrl,
  getPropertyTypeLabel,
  getPurposeLabel,
} from '../utils/formatters';
import { ErrorState } from '../components/ErrorState';
import { useSEO } from '../hooks/useSEO';

export const AdminDashboardPage: React.FC = () => {
  useSEO({
    title: 'Dashboard Administrativo',
  });

  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    available: 0,
    sold: 0,
    rented: 0,
    reserved: 0,
    featured: 0,
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, propertiesData] = await Promise.all([
        getAdminStats(),
        getProperties({ status: 'all_admin', sort: 'newest' }),
      ]);
      setStats(statsData);
      setRecentProperties(propertiesData.slice(0, 8));
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusChange = async (id: string, newStatus: PropertyStatus) => {
    try {
      await updatePropertyStatus(id, newStatus);
      setFeedbackMsg('Status do imóvel atualizado com sucesso.');
      await loadDashboard();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status.');
    }
  };

  const handleSeedExamples = async () => {
    setSeeding(true);
    try {
      const count = await seedDatabaseWithExamples();
      setFeedbackMsg(`${count} imóveis de exemplo restaurados/importados com sucesso.`);
      await loadDashboard();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao importar imóveis de exemplo.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho do Painel */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E6E1DA] pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium text-[#8C6A32]">Gestão Imobiliária</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-[#181615]">
            Visão Geral do Portfólio
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={seeding}
            onClick={handleSeedExamples}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DED8CE] bg-white px-4 py-2.5 text-xs font-medium text-[#181615] transition-colors hover:bg-[#FAF8F5] disabled:opacity-50 whitespace-nowrap"
          >
            <Database className="h-3.5 w-3.5 text-[#8C6A32]" />
            <span>{seeding ? 'Importando...' : 'Importar Imóveis de Exemplo'}</span>
          </button>

          <Link
            to="/admin/imoveis/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-[#181615] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2E2A27] whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 text-[#C8A464]" />
            <span>Cadastrar Novo Imóvel</span>
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div className="rounded-lg border border-[#C3E6CB] bg-[#F2FAF4] px-4 py-3 text-xs font-medium text-[#15803D]">
          {feedbackMsg}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadDashboard} />}

      {/* Métricas do Portfólio (Tabular Numerals) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-[#E6E1DA] bg-white p-5">
          <span className="text-xs text-[#7D746B]">Total Cadastrados</span>
          <span className="mt-2 block font-display text-3xl font-bold text-[#181615] tabular-nums">
            {loading ? '—' : stats.total}
          </span>
        </div>

        <div className="rounded-xl border border-[#E6E1DA] bg-white p-5">
          <span className="text-xs text-[#7D746B]">Ativos / Disponíveis</span>
          <span className="mt-2 block font-display text-3xl font-bold text-[#15803D] tabular-nums">
            {loading ? '—' : stats.available}
          </span>
        </div>

        <div className="rounded-xl border border-[#E6E1DA] bg-white p-5">
          <span className="text-xs text-[#7D746B]">Reservados</span>
          <span className="mt-2 block font-display text-3xl font-bold text-[#B45309] tabular-nums">
            {loading ? '—' : stats.reserved}
          </span>
        </div>

        <div className="rounded-xl border border-[#E6E1DA] bg-white p-5">
          <span className="text-xs text-[#7D746B]">Imóveis Vendidos</span>
          <span className="mt-2 block font-display text-3xl font-bold text-[#181615] tabular-nums">
            {loading ? '—' : stats.sold}
          </span>
        </div>

        <div className="rounded-xl border border-[#E6E1DA] bg-white p-5">
          <span className="text-xs text-[#7D746B]">Imóveis Alugados</span>
          <span className="mt-2 block font-display text-3xl font-bold text-[#1E3A8A] tabular-nums">
            {loading ? '—' : stats.rented}
          </span>
        </div>
      </div>

      {/* Lista de Imóveis Cadastrados Recentemente */}
      <div className="rounded-xl border border-[#E6E1DA] bg-white">
        <div className="flex items-center justify-between border-b border-[#E6E1DA] px-6 py-4">
          <h2 className="font-sans text-sm font-semibold text-[#181615]">
            Imóveis Cadastrados Recentemente
          </h2>
          <Link
            to="/admin/imoveis"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6A32] hover:text-[#181615]"
          >
            <span>Gerenciar todos</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#F0ECE4] bg-[#FAF8F5] text-xs font-semibold text-[#6E665E]">
                <th className="px-6 py-3">Imóvel</th>
                <th className="px-4 py-3">Localização</th>
                <th className="px-4 py-3">Tipo / Finalidade</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {recentProperties.map((prop) => {
                const cover = getCoverImageUrl(prop);
                return (
                  <tr key={prop.id} className="hover:bg-[#FAF8F5]/60">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-14 shrink-0 overflow-hidden rounded border border-[#E6E1DA] bg-[#F0ECE3]">
                          {cover && (
                            <img
                              src={cover}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="truncate font-medium text-[#181615]">{prop.title}</p>
                          <p className="font-mono-tabular text-xs text-[#7D746B]">
                            Cód. {prop.id.slice(0, 8).toUpperCase()}
                            {prop.featured ? ' · Em destaque' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#575049] whitespace-nowrap">
                      {prop.neighborhood}, {prop.city}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#575049] whitespace-nowrap">
                      {getPropertyTypeLabel(prop.property_type)} · {getPurposeLabel(prop.purpose)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-[#181615] tabular-nums whitespace-nowrap">
                      {formatCurrency(prop.price)}
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        aria-label={`Alterar status de ${prop.title}`}
                        value={prop.status}
                        onChange={(e) =>
                          handleStatusChange(prop.id, e.target.value as PropertyStatus)
                        }
                        className="rounded-md border border-[#DED8CE] bg-white px-2.5 py-1 text-xs font-medium text-[#181615] focus:border-[#C8A464] focus:outline-none"
                      >
                        <option value="available">Disponível</option>
                        <option value="reserved">Reservado</option>
                        <option value="sold">Vendido</option>
                        <option value="rented">Alugado</option>
                      </select>
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/imovel/${prop.slug || prop.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Visualizar página pública"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E6E1DA] text-[#575049] hover:text-[#181615]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          to={`/admin/imoveis/${prop.id}/editar`}
                          title="Editar imóvel"
                          className="inline-flex items-center gap-1 rounded-md border border-[#E6E1DA] bg-white px-2.5 py-1.5 text-xs font-medium text-[#181615] hover:border-[#C8A464]"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-[#8C6A32]" />
                          <span>Editar</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!loading && recentProperties.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-[#6E665E]">
                    Nenhum imóvel cadastrado. Clique em &ldquo;Cadastrar Novo Imóvel&rdquo; para
                    começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
