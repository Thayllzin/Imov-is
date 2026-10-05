import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X, Building2 } from 'lucide-react';
import { PropertyImage } from '../types/property';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % sortedImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, sortedImages.length]);

  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-[16/9] w-full flex-col items-center justify-center rounded-xl border border-[#E6E1DA] bg-[#F0ECE3] text-[#7D746B]">
        <Building2 className="mb-2 h-10 w-10 text-[#9E9386]" />
        <span className="text-sm font-medium">Imagens em atualização para este imóvel</span>
      </div>
    );
  }

  const currentImage = sortedImages[activeIndex] || sortedImages[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const markFailed = (url: string) => {
    setFailedUrls((prev) => ({ ...prev, [url]: true }));
  };

  return (
    <div className="space-y-3">
      {/* Foto Principal com clique para abrir Lightbox */}
      <div
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true);
        }}
        aria-label="Ampliar foto do imóvel"
        className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border border-[#E6E1DA] bg-[#181615] sm:aspect-[16/9]"
      >
        {!failedUrls[currentImage.image_url] ? (
          <img
            src={currentImage.image_url}
            alt={`${title} — Foto ${activeIndex + 1}`}
            referrerPolicy="no-referrer"
            onError={() => markFailed(currentImage.image_url)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#231F1C] text-white/70">
            <Building2 className="mb-2 h-10 w-10" />
            <span className="text-sm">{title}</span>
          </div>
        )}

        {/* Controles Anterior / Próxima sobre a imagem */}
        {sortedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-xs transition-colors hover:bg-black/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-xs transition-colors hover:bg-black/80"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicador de quantidade e botão ampliar */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="rounded-md bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xs tabular-nums">
            Foto {activeIndex + 1} de {sortedImages.length}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xs">
            <Expand className="h-3.5 w-3.5 text-[#C8A464]" />
            <span>Ampliar galeria</span>
          </span>
        </div>
      </div>

      {/* Miniaturas horizontais responsivas */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {sortedImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Selecionar miniatura ${idx + 1}`}
                className={`relative h-18 w-26 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-32 ${
                  isSelected
                    ? 'border-[#C8A464] opacity-100'
                    : 'border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                {!failedUrls[img.image_url] ? (
                  <img
                    src={img.image_url}
                    alt={`${title} miniatura ${idx + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => markFailed(img.image_url)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#EFEBE3]">
                    <Building2 className="h-4 w-4 text-[#8C8277]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal em Tela Cheia */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada das fotos do imóvel"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
        >
          {/* Topo do Lightbox */}
          <div className="flex w-full max-w-6xl items-center justify-between pb-4 text-white">
            <div className="text-sm font-medium truncate max-w-lg">
              <span>{title}</span>
              <span className="mx-2 text-white/40">·</span>
              <span className="tabular-nums text-white/75">
                {activeIndex + 1} / {sortedImages.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Fechar visualização ampliada"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Imagem Central Ampliada mantendo proporção */}
          <div className="relative flex flex-1 w-full max-w-6xl items-center justify-center overflow-hidden">
            {!failedUrls[currentImage.image_url] ? (
              <img
                src={currentImage.image_url}
                alt={`${title} ampliada ${activeIndex + 1}`}
                referrerPolicy="no-referrer"
                className="max-h-[78vh] max-w-full rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-64 w-96 items-center justify-center rounded-lg bg-white/10 text-white">
                <span>Imagem indisponível</span>
              </div>
            )}

            {sortedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Foto anterior"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-colors hover:bg-white/30"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Próxima foto"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xs transition-colors hover:bg-white/30"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas no rodapé do Lightbox */}
          {sortedImages.length > 1 && (
            <div className="mt-4 flex max-w-4xl gap-2 overflow-x-auto py-1">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded border-2 transition-all ${
                    idx === activeIndex
                      ? 'border-[#C8A464] opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-90'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
