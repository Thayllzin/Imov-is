import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit3, Trash2, ExternalLink } from 'lucide-react';
import {
  deleteProperty,
  getProperties,
  updatePropertyStatus,
} from '../services/propertyService';
import {
  Property,
  PropertyFilters,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
} from '../types/property';
import {
  formatCurrency,
  getCoverImageUrl,
  getPropertyTypeLabel,
  getPurposeLabel,
} from '../utils/formatters';
import { ErrorState } from '../components/ErrorState';
import { useSEO } from '../hooks/useSEO';

export const AdminPropertiesPage: React.FC = () => {
  useSEO({
    title: 'Gerenciar Imóveis — Painel Administrativo',
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [filters, setFilters] = useState<PropertyFilters>({
    search: '',
    property_type: '',
    purpose: '',
    status: 'all_admin',
    sort: 'newest',
  });

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProperties(filters);
      setProperties(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao listar imóveis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [filters]);

  const handleStatusChange = async (id: string, status: PropertyStatus) => {
    try {
      await updatePropertyStatus(id, status);
      setProperties((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      setFeedback('Status atualizado com sucesso.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
      setFeedback('Imóvel excluído com sucesso.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir imóvel.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E6E1DA] pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium text-[#8C6A32]">Catálogo Administrativo</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-[#181615]">
            Gerenciamento de Imóveis
          </h1>
        </div>

        <Link
          to="/admin/imoveis/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-[#181615] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#2E2A27] whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4 text-[#C8A464]" />
          <span>Novo Imóvel</span>
        </Link>
      </div>

      {feedback && (
        <div className="rounded-lg border border-[#C3E6CB] bg-[#F2FAF4] px-4 py-3 text-xs font-medium text-[#15803D]">
          {feedback}
        </div>
      )}

      {error && <ErrorState message={error} onRetry={loadList} />}

      {/* Barra de Pesquisa e Filtros Administrativos */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#E6E1DA] bg-white p-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8277]" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Buscar por título, bairro, cidade ou código..."
            className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] py-2 pl-9 pr-3 text-xs text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="lg:col-span-3">
          <select
            value={filters.property_type || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                property_type: e.target.value as PropertyType | '',
              }))
            }
            className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-xs text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
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

        <div className="lg:col-span-2">
          <select
            value={filters.purpose || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                purpose: e.target.value as PropertyPurpose | '',
              }))
            }
            className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-xs text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          >
            <option value="">Venda e Aluguel</option>
            <option value="sale">Venda</option>
            <option value="rent">Aluguel</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <select
            value={filters.status || 'all_admin'}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value as PropertyFilters['status'],
              }))
            }
            className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-xs text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          >
            <option value="all_admin">Todos os status</option>
            <option value="available">Disponível</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
            <option value="rented">Alugado</option>
          </select>
        </div>
      </div>

      {/* Tabela de Imóveis */}
      <div className="overflow-hidden rounded-xl border border-[#E6E1DA] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#F0ECE4] bg-[#FAF8F5] text-xs font-semibold text-[#6E665E]">
                <th className="px-6 py-3">Imóvel</th>
                <th className="px-4 py-3">Bairro / Cidade</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE4]">
              {properties.map((prop) => {
                const cover = getCoverImageUrl(prop);
                const isConfirming = confirmDeleteId === prop.id;
                const isDeleting = deletingId === prop.id;

                return (
                  <tr key={prop.id} className="hover:bg-[#FAF8F5]/60">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded border border-[#E6E1DA] bg-[#F0ECE3]">
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
                            {(prop.images || []).length} fotos ·{' '}
                            {prop.featured ? 'Destaque na Home' : 'Catálogo padrão'}
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
                      {isConfirming ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(prop.id)}
                            className="rounded bg-[#B42318] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#912018]"
                          >
                            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded border border-[#DED8CE] bg-white px-2 py-1 text-xs text-[#575049]"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/imovel/${prop.slug || prop.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver página pública"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E6E1DA] text-[#575049] hover:text-[#181615]"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          <Link
                            to={`/admin/imoveis/${prop.id}/editar`}
                            className="inline-flex items-center gap-1 rounded-md border border-[#E6E1DA] bg-white px-2.5 py-1.5 text-xs font-medium text-[#181615] hover:border-[#C8A464]"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-[#8C6A32]" />
                            <span>Editar</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(prop.id)}
                            title="Excluir imóvel"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#E6E1DA] text-[#B42318] hover:bg-[#FDF2F2]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!loading && properties.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#6E665E]">
                    Nenhum imóvel encontrado com os filtros informados.
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
