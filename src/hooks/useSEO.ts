import { useEffect } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

export function useSEO({ title, description, image, jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_CONFIG.brandFullTitle}`
      : `${SITE_CONFIG.brandFullTitle} — ${SITE_CONFIG.tagline}`;

    const metaDesc =
      description ||
      'Encontre residências contemporâneas, coberturas e imóveis exclusivos para compra e locação com a curadoria especializada de Marcela Cardoso Imóveis.';

    document.title = fullTitle;

    const setMetaTag = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    setMetaTag('meta[name="description"]', metaDesc);
    setMetaTag('meta[property="og:title"]', fullTitle);
    setMetaTag('meta[property="og:description"]', metaDesc);
    setMetaTag('meta[name="twitter:title"]', fullTitle);
    setMetaTag('meta[name="twitter:description"]', metaDesc);

    if (image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', image);
    }

    let scriptEl = document.getElementById('dynamic-json-ld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'dynamic-json-ld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, image, jsonLd]);
}
