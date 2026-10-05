import React from 'react';

interface PropertyFeaturesProps {
  features: string[];
}

export const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#E6E1DA] pt-8">
      <h2 className="font-display text-2xl font-semibold text-[#181615]">
        Diferenciais e Características
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-baseline gap-3 border-b border-[#F0ECE4] pb-2.5 text-sm text-[#3B3632]"
          >
            <span className="font-mono-tabular text-xs font-medium text-[#8C6A32]">
              {String(index + 1).padStart(2, '0')}.
            </span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
