import React, { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';
import {
  Property,
  PropertyFormData,
  PropertyImage,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
} from '../types/property';
import { generateSlug } from '../utils/formatters';
import { ImageGalleryManager } from './ImageGalleryManager';
import { ImageUploader, PendingImageItem } from './ImageUploader';

interface PropertyFormProps {
  initialProperty?: Property | null;
  onSubmit: (
    formData: PropertyFormData,
    newFiles: File[],
    selectedCoverIndex: number | null
  ) => Promise<void>;
  onSetExistingCover?: (imageId: string) => Promise<void>;
  onDeleteExistingImage?: (image: PropertyImage) => Promise<void>;
  onReorderExistingImages?: (ordered: PropertyImage[]) => Promise<void>;
  isSubmitting: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialProperty,
  onSubmit,
  onSetExistingCover,
  onDeleteExistingImage,
  onReorderExistingImages,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialProperty?.title || '',
    slug: initialProperty?.slug || '',
    description: initialProperty?.description || '',
    property_type: initialProperty?.property_type || 'house',
    purpose: initialProperty?.purpose || 'sale',
    price: initialProperty?.price ?? 0,
    condominium_fee: initialProperty?.condominium_fee ?? 0,
    iptu: initialProperty?.iptu ?? 0,
    city: initialProperty?.city || 'Belém',
    state: initialProperty?.state || 'PA',
    neighborhood: initialProperty?.neighborhood || '',
    address: initialProperty?.address || '',
    bedrooms: initialProperty?.bedrooms ?? 3,
    suites: initialProperty?.suites ?? 1,
    bathrooms: initialProperty?.bathrooms ?? 2,
    parking_spaces: initialProperty?.parking_spaces ?? 2,
    total_area: initialProperty?.total_area ?? 0,
    built_area: initialProperty?.built_area ?? 0,
    status: initialProperty?.status || 'available',
    featured: initialProperty?.featured ?? false,
    latitude:
      initialProperty?.latitude !== null && initialProperty?.latitude !== undefined
        ? String(initialProperty.latitude)
        : '',
    longitude:
      initialProperty?.longitude !== null && initialProperty?.longitude !== undefined
        ? String(initialProperty.longitude)
        : '',
    features: initialProperty?.features || [
      'Acabamento em alto padrão',
      'Segurança 24 horas',
    ],
  });

  const [newFeatureText, setNewFeatureText] = useState('');
  const [existingImages, setExistingImages] = useState<PropertyImage[]>(
    initialProperty?.images || []
  );
  const [pendingImages, setPendingImages] = useState<PendingImageItem[]>([]);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number | null>(
    initialProperty?.images && initialProperty.images.length > 0 ? null : 0
  );
  const [busyImageId, setBusyImageId] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialProperty?.slug));

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : generateSlug(value),
    }));
  };

  const handleAddFiles = (fileList: FileList) => {
    const added: PendingImageItem[] = Array.from(fileList).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => {
      const next = [...prev, ...added];
      if (existingImages.length === 0 && selectedCoverIndex === null && next.length > 0) {
        setSelectedCoverIndex(0);
      }
      return next;
    });
  };

  const handleRemovePending = (index: number) => {
    setPendingImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      const next = prev.filter((_, i) => i !== index);
      if (selectedCoverIndex === index) {
        setSelectedCoverIndex(next.length > 0 && existingImages.length === 0 ? 0 : null);
      } else if (selectedCoverIndex !== null && selectedCoverIndex > index) {
        setSelectedCoverIndex(selectedCoverIndex - 1);
      }
      return next;
    });
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, newFeatureText.trim()],
    }));
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleSetExistingCover = async (imageId: string) => {
    setBusyImageId(imageId);
    try {
      if (onSetExistingCover) {
        await onSetExistingCover(imageId);
      }
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, is_cover: img.id === imageId }))
      );
      setSelectedCoverIndex(null);
    } finally {
      setBusyImageId(null);
    }
  };

  const handleDeleteExistingImage = async (image: PropertyImage) => {
    setBusyImageId(image.id);
    try {
      if (onDeleteExistingImage) {
        await onDeleteExistingImage(image);
      }
      setExistingImages((prev) => {
        const remaining = prev.filter((item) => item.id !== image.id);
        if (image.is_cover && remaining.length > 0) {
          remaining[0].is_cover = true;
        }
        return remaining;
      });
    } finally {
      setBusyImageId(null);
    }
  };

  const handleMoveExistingImage = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= existingImages.length) return;

    const updated = [...existingImages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    const reordered = updated.map((img, idx) => ({ ...img, display_order: idx }));

    setExistingImages(reordered);
    if (onReorderExistingImages) {
      await onReorderExistingImages(reordered);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const files = pendingImages.map((item) => item.file);
    await onSubmit(formData, files, selectedCoverIndex);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Informações Principais */}
      <section className="rounded-xl border border-[#E6E1DA] bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-[#181615]">
          1. Informações Principais do Imóvel
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-8">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Título do Imóvel *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Sobrado Contemporâneo com 4 Suítes no Parque Verde"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              URL Amigável (Slug) *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
              }}
              placeholder="sobrado-contemporaneo-parque-verde"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 font-mono-tabular text-xs text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Tipo de Imóvel *
            </label>
            <select
              value={formData.property_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  property_type: e.target.value as PropertyType,
                }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            >
              <option value="house">Casa / Sobrado</option>
              <option value="apartment">Apartamento</option>
              <option value="villa">Condomínio Fechado</option>
              <option value="penthouse">Cobertura</option>
              <option value="land">Terreno / Lote</option>
              <option value="commercial">Comercial</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Finalidade *
            </label>
            <select
              value={formData.purpose}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  purpose: e.target.value as PropertyPurpose,
                }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            >
              <option value="sale">Venda</option>
              <option value="rent">Aluguel</option>
              <option value="both">Venda e Aluguel</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Status do Imóvel *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as PropertyStatus,
                }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            >
              <option value="available">Disponível (available)</option>
              <option value="reserved">Reservado (reserved)</option>
              <option value="sold">Vendido (sold)</option>
              <option value="rented">Alugado (rented)</option>
            </select>
          </div>

          <div className="md:col-span-12">
            <label className="inline-flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="h-4 w-4 rounded border-[#D8D1C7] text-[#181615] focus:ring-[#C8A464]"
              />
              <span className="text-sm font-medium text-[#181615]">
                Exibir este imóvel na seção &ldquo;Imóveis em Destaque&rdquo; da página inicial
              </span>
            </label>
          </div>

          <div className="md:col-span-12">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Descrição Completa *
            </label>
            <textarea
              rows={5}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Descreva os ambientes, acabamentos, posição solar e diferenciais do imóvel..."
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] p-3.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 2. Valores */}
      <section className="rounded-xl border border-[#E6E1DA] bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-[#181615]">
          2. Valores e Encargos (R$)
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Preço Principal (R$) *
            </label>
            <input
              type="number"
              required
              min={0}
              step="any"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] tabular-nums focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Condomínio Mensal (R$)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={formData.condominium_fee}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condominium_fee: Number(e.target.value),
                }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] tabular-nums focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              IPTU (R$)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={formData.iptu}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, iptu: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] tabular-nums focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Localização e Coordenadas */}
      <section className="rounded-xl border border-[#E6E1DA] bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-[#181615]">
          3. Localização e Coordenadas para Mapa
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-12">
          <div className="md:col-span-5">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Cidade *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Ex: Belém"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Estado (UF) *
            </label>
            <input
              type="text"
              required
              maxLength={2}
              value={formData.state}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, state: e.target.value.toUpperCase() }))
              }
              placeholder="PA"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-5">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Bairro *
            </label>
            <input
              type="text"
              required
              value={formData.neighborhood}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))
              }
              placeholder="Ex: Umarizal, Nazaré, Parque Verde"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-6">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Endereço / Condomínio
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Ex: Av. Braz de Aguiar, 612"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Latitude (Opcional)
            </label>
            <input
              type="text"
              value={formData.latitude}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, latitude: e.target.value }))
              }
              placeholder="Ex: -1.4412"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 font-mono-tabular text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Longitude (Opcional)
            </label>
            <input
              type="text"
              value={formData.longitude}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, longitude: e.target.value }))
              }
              placeholder="Ex: -48.4856"
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2.5 font-mono-tabular text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 4. Dimensões e Cômodos */}
      <section className="rounded-xl border border-[#E6E1DA] bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-[#181615]">
          4. Cômodos e Metragem
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Quartos
            </label>
            <input
              type="number"
              min={0}
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bedrooms: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] tabular-nums"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Suítes
            </label>
            <input
              type="number"
              min={0}
              value={formData.suites}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, suites: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] tabular-nums"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Banheiros
            </label>
            <input
              type="number"
              min={0}
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bathrooms: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] tabular-nums"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Vagas
            </label>
            <input
              type="number"
              min={0}
              value={formData.parking_spaces}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking_spaces: Number(e.target.value),
                }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] tabular-nums"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Área Total (m²) *
            </label>
            <input
              type="number"
              min={0}
              step="any"
              required
              value={formData.total_area}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, total_area: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] tabular-nums"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#181615]">
              Área Construída (m²)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={formData.built_area}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, built_area: Number(e.target.value) }))
              }
              className="w-full rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3 py-2 text-sm text-[#181615] tabular-nums"
            />
          </div>
        </div>
      </section>

      {/* 5. Características / Diferenciais */}
      <section className="rounded-xl border border-[#E6E1DA] bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-[#181615]">
          5. Características e Diferenciais
        </h2>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newFeatureText}
            onChange={(e) => setNewFeatureText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddFeature();
              }
            }}
            placeholder="Ex: Piscina aquecida, Pergolado em vidro, Gerador 100%..."
            className="flex-1 rounded-lg border border-[#DED8CE] bg-[#FAF8F5] px-3.5 py-2 text-sm text-[#181615] focus:border-[#C8A464] focus:bg-white focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddFeature}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#181615] px-4 py-2 text-xs font-medium text-white hover:bg-[#2E2A27] whitespace-nowrap"
          >
            <Plus className="h-4 w-4 text-[#C8A464]" />
            <span>Adicionar item</span>
          </button>
        </div>

        {formData.features.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {formData.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-[#E6E1DA] bg-[#FAF8F5] px-3 py-2 text-xs text-[#181615]"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  aria-label="Remover característica"
                  className="text-[#8C8277] hover:text-[#B42318]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Galeria de Fotos (Supabase Storage: property-images) */}
      <section className="rounded-xl border border-[#E6E1DA] bg-white p-6 space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[#181615]">
            6. Fotos do Imóvel
          </h2>
          <p className="mt-1 text-xs text-[#6E665E]">
            Envie múltiplas fotos, escolha a imagem principal (capa) e organize a ordem de
            exibição.
          </p>
        </div>

        <ImageGalleryManager
          images={existingImages}
          onSetCover={handleSetExistingCover}
          onDeleteImage={handleDeleteExistingImage}
          onMoveImage={handleMoveExistingImage}
          busyImageId={busyImageId}
        />

        <ImageUploader
          pendingImages={pendingImages}
          selectedCoverIndex={selectedCoverIndex}
          onAddFiles={handleAddFiles}
          onRemovePending={handleRemovePending}
          onSelectCoverIndex={(index) => setSelectedCoverIndex(index)}
        />
      </section>

      {/* Botão Salvar */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[#181615] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2E2A27] disabled:opacity-60 whitespace-nowrap"
        >
          <Save className="h-4 w-4 text-[#C8A464]" />
          <span>{isSubmitting ? 'Salvando imóvel e fotos...' : 'Salvar Imóvel'}</span>
        </button>
      </div>
    </form>
  );
};
