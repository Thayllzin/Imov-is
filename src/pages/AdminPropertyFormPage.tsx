import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PropertyForm } from '../components/PropertyForm';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import {
  createProperty,
  deletePropertyImage,
  getPropertyBySlugOrId,
  reorderPropertyImages,
  setCoverImage,
  updateProperty,
  uploadPropertyImages,
} from '../services/propertyService';
import { Property, PropertyFormData, PropertyImage } from '../types/property';
import { useSEO } from '../hooks/useSEO';

export const AdminPropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  useSEO({
    title: isEditMode ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel',
  });

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    getPropertyBySlugOrId(id)
      .then((found) => {
        if (active) setProperty(found);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar imóvel.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (
    formData: PropertyFormData,
    newFiles: File[],
    selectedCoverIndex: number | null
  ) => {
    setSubmitting(true);
    setError(null);
    try {
      let savedProperty: Property;
      if (isEditMode && property) {
        savedProperty = await updateProperty(property.id, formData);
      } else {
        savedProperty = await createProperty(formData);
      }

      if (newFiles.length > 0) {
        const startingOrder = property?.images ? property.images.length : 0;
        await uploadPropertyImages(
          savedProperty.id,
          newFiles,
          selectedCoverIndex,
          startingOrder
        );
      }

      navigate('/admin/imoveis');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Ocorreu um erro ao salvar o imóvel.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetExistingCover = async (imageId: string) => {
    if (!property) return;
    await setCoverImage(property.id, imageId);
  };

  const handleDeleteExistingImage = async (image: PropertyImage) => {
    if (!property) return;
    await deletePropertyImage(property.id, image);
  };

  const handleReorderExistingImages = async (ordered: PropertyImage[]) => {
    if (!property) return;
    await reorderPropertyImages(property.id, ordered);
  };

  if (loading) {
    return <LoadingState message="Carregando dados do imóvel..." count={2} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/imoveis"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#575049] hover:text-[#181615]"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#8C6A32]" />
          <span>Voltar para a lista de imóveis</span>
        </Link>

        <h1 className="mt-3 font-display text-3xl font-semibold text-[#181615]">
          {isEditMode ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
        </h1>
        <p className="mt-1 text-xs text-[#6E665E]">
          Preencha as informações abaixo, adicione fotos e escolha a foto principal de capa.
        </p>
      </div>

      {error && <ErrorState message={error} />}

      <PropertyForm
        initialProperty={property}
        onSubmit={handleSubmit}
        onSetExistingCover={handleSetExistingCover}
        onDeleteExistingImage={handleDeleteExistingImage}
        onReorderExistingImages={handleReorderExistingImages}
        isSubmitting={submitting}
      />
    </div>
  );
};
