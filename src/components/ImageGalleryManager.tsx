import React from 'react';
import { ArrowLeft, ArrowRight, Star, Trash2 } from 'lucide-react';
import { PropertyImage } from '../types/property';

interface ImageGalleryManagerProps {
  images: PropertyImage[];
  onSetCover: (imageId: string) => void;
  onDeleteImage: (image: PropertyImage) => void;
  onMoveImage: (index: number, direction: 'left' | 'right') => void;
  busyImageId?: string | null;
}

export const ImageGalleryManager: React.FC<ImageGalleryManagerProps> = ({
  images,
  onSetCover,
  onDeleteImage,
  onMoveImage,
  busyImageId,
}) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-[#181615]">
          Fotos já salvas no imóvel ({images.length})
        </h3>
        <span className="text-xs text-[#6E665E]">
          Use as setas para reordenar ou defina a foto principal
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, idx) => {
          const isBusy = busyImageId === img.id;
          return (
            <div
              key={img.id}
              className={`flex flex-col justify-between overflow-hidden rounded-lg border-2 bg-white transition-opacity ${
                img.is_cover ? 'border-[#C8A464]' : 'border-[#E6E1DA]'
              } ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0ECE3]">
                <img
                  src={img.image_url}
                  alt={`Foto ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white tabular-nums">
                  #{idx + 1}
                </span>
              </div>

              <div className="space-y-2 p-2.5">
                <button
                  type="button"
                  onClick={() => onSetCover(img.id)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    img.is_cover
                      ? 'bg-[#C8A464] text-[#181615] font-semibold'
                      : 'bg-[#FAF8F5] text-[#575049] hover:bg-[#F0ECE3] hover:text-[#181615]'
                  }`}
                >
                  <Star className="h-3.5 w-3.5" />
                  <span>{img.is_cover ? 'Foto Principal' : 'Tornar Principal'}</span>
                </button>

                <div className="flex items-center justify-between border-t border-[#F0ECE4] pt-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveImage(idx, 'left')}
                      aria-label="Mover para esquerda"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#E6E1DA] text-[#575049] hover:bg-[#FAF8F5] disabled:opacity-30"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => onMoveImage(idx, 'right')}
                      aria-label="Mover para direita"
                      className="inline-flex h-7 w-7 items-center justify-center rounded border border-[#E6E1DA] text-[#575049] hover:bg-[#FAF8F5] disabled:opacity-30"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteImage(img)}
                    aria-label="Excluir foto"
                    className="inline-flex h-7 w-7 items-center justify-center rounded text-[#B42318] hover:bg-[#FDF2F2]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
