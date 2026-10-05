import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/formatters';

interface WhatsAppButtonProps {
  propertyTitle?: string;
  propertyCode?: string;
  propertyUrl?: string;
  customMessage?: string;
  label?: string;
  variant?: 'primary' | 'gold' | 'outline' | 'floating';
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  propertyTitle,
  propertyCode,
  propertyUrl,
  customMessage,
  label = 'Tenho interesse',
  variant = 'primary',
  className = '',
}) => {
  const href = buildWhatsAppUrl({
    propertyTitle,
    propertyCode,
    propertyUrl,
    customMessage,
  });

  if (variant === 'floating') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar pelo WhatsApp"
        className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#181615] px-4 py-3 text-xs font-medium text-white shadow-lg transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#2C2825] ${className}`}
      >
        <MessageCircle className="h-4 w-4 text-[#C8A464]" />
        <span className="hidden sm:inline whitespace-nowrap">Atendimento WhatsApp</span>
      </a>
    );
  }

  const variantClasses: Record<string, string> = {
    primary:
      'bg-[#181615] text-white hover:bg-[#2C2825] border border-transparent',
    gold:
      'bg-[#C8A464] text-[#181615] hover:bg-[#B89352] border border-transparent font-semibold',
    outline:
      'bg-white text-[#181615] border border-[#D8D1C7] hover:border-[#181615] hover:bg-[#FAF8F5]',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap ${variantClasses[variant]} ${className}`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </a>
  );
};
