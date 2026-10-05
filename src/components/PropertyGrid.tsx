import React from 'react';
import { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';
import { EmptyState } from './EmptyState';

interface PropertyGridProps {
  properties: Property[];
  columns?: 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  columns = 4,
  emptyTitle,
  emptyDescription,
  onResetFilters,
}) => {
  if (properties.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Limpar todos os filtros' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  const gridCols =
    columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};
