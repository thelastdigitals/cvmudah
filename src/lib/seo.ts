interface SeoConfig {
  siteUrl: string;
  contactEmail: string;
}

export const SITE_CONFIG: SeoConfig = {
  // Set to your production domain after publishing, e.g. https://cvmudah.example.com
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) ?? '',
  // Set your official contact email here before publishing, e.g. halo@cvmudah.com
  contactEmail: (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? '',
};

export const SITE_NAME = 'CVMudah';
export const SITE_TAGLINE = 'Buat CV Profesional, Lamar Kerja Lebih Percaya Diri.';

export interface PageSeo {
  title: string;
  description: string;
  path: string;
}

export function applySeo(seo: PageSeo): void {
  document.title = seo.title;

  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('name', 'description', seo.description);
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:type', 'website');
  if (SITE_CONFIG.siteUrl) {
    setMeta('property', 'og:url', `${SITE_CONFIG.siteUrl.replace(/\/$/, '')}${seo.path}`);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `${SITE_CONFIG.siteUrl.replace(/\/$/, '')}${seo.path}`;
  }
}
