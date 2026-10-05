import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Carregando imóveis selecionados...',
  count = 4,
}) => {
  return (
    <div className="w-full py-8" aria-live="polite" aria-busy="true">
      <div className="mb-6 flex items-center gap-3 text-sm text-[#6E665E]">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#C8A464] border-t-transparent" />
        <span>{message}</span>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-[#E6E1DA] bg-white"
          >
            <div className="aspect-[4/3] w-full animate-pulse bg-[#EFECE6]" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-1/3 animate-pulse rounded bg-[#EFECE6]" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-[#EFECE6]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#EFECE6]" />
              <div className="h-6 w-2/5 animate-pulse rounded bg-[#EFECE6]" />
              <div className="border-t border-[#F0ECE4] pt-3">
                <div className="h-3 w-full animate-pulse rounded bg-[#EFECE6]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
