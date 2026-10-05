import React, { useRef } from 'react';
import { Upload, Star, Trash2 } from 'lucide-react';

export interface PendingImageItem {
  file: File;
  previewUrl: string;
}

interface ImageUploaderProps {
  pendingImages: PendingImageItem[];
  selectedCoverIndex: number | null;
  onAddFiles: (files: FileList) => void;
  onRemovePending: (index: number) => void;
  onSelectCoverIndex: (index: number) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  pendingImages,
  selectedCoverIndex,
  onAddFiles,
  onRemovePending,
  onSelectCoverIndex,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8D1C7] bg-[#FAF8F5] px-6 py-8 text-center transition-colors hover:border-[#C8A464] hover:bg-[#F5F1EA]"
      >
        <Upload className="mb-2.5 h-7 w-7 text-[#8C6A32]" />
        <p className="text-sm font-semibold text-[#181615]">
          Clique para selecionar fotos do imóvel
        </p>
        <p className="mt-1 text-xs text-[#6E665E]">
          Suporta seleção de múltiplas imagens (JPG, PNG, WEBP). Escolha qual será a foto principal
          abaixo.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {pendingImages.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#181615]">
              Novas fotos prontas para envio ({pendingImages.length})
            </span>
            <span className="text-xs text-[#6E665E]">
              Clique em &ldquo;Foto Principal&rdquo; para definir a capa
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {pendingImages.map((item, idx) => {
              const isCover = selectedCoverIndex === idx;
              return (
                <div
                  key={`${item.file.name}-${idx}`}
                  className={`group relative overflow-hidden rounded-lg border-2 bg-white ${
                    isCover ? 'border-[#C8A464]' : 'border-[#E6E1DA]'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#F0ECE3]">
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-1 p-2">
                    <button
                      type="button"
                      onClick={() => onSelectCoverIndex(idx)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                        isCover
                          ? 'bg-[#C8A464] text-[#181615] font-semibold'
                          : 'bg-[#F3EFE8] text-[#575049] hover:text-[#181615]'
                      }`}
                    >
                      <Star className="h-3 w-3" />
                      <span>{isCover ? 'Capa Principal' : 'Definir Capa'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemovePending(idx)}
                      aria-label="Remover foto da lista de envio"
                      className="inline-flex h-7 w-7 items-center justify-center rounded text-[#B42318] hover:bg-[#FDF2F2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
