import React from 'react';
import { Building2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum imóvel encontrado',
  description = 'Não encontramos imóveis que correspondam aos filtros selecionados. Experimente ampliar os critérios da sua busca.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#E6E1DA] bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F1EA] text-[#8C734B]">
        <Building2 className="h-6 w-6" />
      </div>
      <h3 className="font-display text-2xl font-semibold text-[#181615]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6E665E]">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#181615] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2E2A27] whitespace-nowrap"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
