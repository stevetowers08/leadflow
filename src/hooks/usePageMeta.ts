import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export const usePageMeta = (meta: PageMeta) => {
  useEffect(() => {
    // Only update meta tags on client-side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Update document title
    document.title = meta.title;

    // Update or create meta tags
    const updateMetaTag = (
      name: string,
      content: string,
      property?: boolean
    ) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;

      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (property) {
          metaTag.setAttribute('property', name);
        } else {
          metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
      }

      metaTag.setAttribute('content', content);
    };

    // Update basic meta tags
    updateMetaTag('description', meta.description);
    if (meta.keywords) {
      updateMetaTag('keywords', meta.keywords);
    }

    // Update Open Graph meta tags
    updateMetaTag('og:title', meta.ogTitle || meta.title, true);
    updateMetaTag(
      'og:description',
      meta.ogDescription || meta.description,
      true
    );
    updateMetaTag('og:type', 'website', true);
    if (meta.ogImage) {
      updateMetaTag('og:image', meta.ogImage, true);
    }

    // Update Twitter meta tags
    updateMetaTag('twitter:title', meta.twitterTitle || meta.title);
    updateMetaTag(
      'twitter:description',
      meta.twitterDescription || meta.description
    );
    updateMetaTag('twitter:card', 'summary_large_image');
    if (meta.twitterImage) {
      updateMetaTag('twitter:image', meta.twitterImage);
    }

    // Cleanup function to restore default meta tags when component unmounts
    return () => {
      document.title = 'RECRUITEDGE';
      updateMetaTag(
        'description',
        'Modern CRM platform for recruitment and lead management'
      );
      updateMetaTag('og:title', 'RECRUITEDGE', true);
      updateMetaTag(
        'og:description',
        'Modern CRM platform for recruitment and lead management',
        true
      );
      updateMetaTag('twitter:title', 'RECRUITEDGE');
      updateMetaTag(
        'twitter:description',
        'Modern CRM platform for recruitment and lead management'
      );
    };
  }, [meta]);
};
