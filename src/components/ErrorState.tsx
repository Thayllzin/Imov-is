import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Não foi possível carregar as informações',
  message,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-[#E8D2CE] bg-[#FDF8F7] px-6 py-12 text-center"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F9E6E3] text-[#B42318]">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl font-semibold text-[#181615]">{title}</h3>
      <p className="mt-1.5 max-w-lg text-sm text-[#6E665E]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#D4C8BC] bg-white px-4 py-2 text-xs font-medium text-[#181615] transition-colors hover:bg-[#F5F1EA] whitespace-nowrap"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Tentar novamente</span>
        </button>
      )}
    </div>
  );
};
