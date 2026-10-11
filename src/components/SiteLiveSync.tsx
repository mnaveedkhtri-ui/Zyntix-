'use client';
import { useEffect } from 'react';

interface SiteLiveSyncProps {
  subdomain: string;
}

export function SiteLiveSync({ subdomain }: SiteLiveSyncProps) {
  useEffect(() => {
    const applySiteToDOM = (site: any) => {
      if (!site) return;

      if (site.contact?.phone) {
        const phoneEls = document.querySelectorAll('[data-contact-phone]');
        phoneEls.forEach((el) => {
          el.textContent = site.contact.phone;
          if (el.tagName === 'A') (el as HTMLAnchorElement).href = `tel:${site.contact.phone}`;
        });
      }
      if (site.contact?.email) {
        const emailEls = document.querySelectorAll('[data-contact-email]');
        emailEls.forEach((el) => {
          el.textContent = site.contact.email;
          if (el.tagName === 'A') (el as HTMLAnchorElement).href = `mailto:${site.contact.email}`;
        });
      }
      if (site.contact?.address || site.location) {
        const targetAddress = site.contact?.address || site.location;
        const addrEls = document.querySelectorAll('[data-contact-address]');
        addrEls.forEach((el) => {
          el.textContent = targetAddress;
        });
      }
      if (site.location) {
        const locEls = document.querySelectorAll('[data-site-location]');
        locEls.forEach((el) => {
          el.textContent = site.location;
        });
        const locHeaderEls = document.querySelectorAll('[data-site-location-header]');
        locHeaderEls.forEach((el) => {
          el.innerHTML = `Atelier &bull; Est. 2008 &bull; ${site.location}`;
        });
      }
      if (site.name) {
        const nameEls = document.querySelectorAll('[data-site-name]');
        nameEls.forEach((el) => {
          el.textContent = site.name;
        });
      }
    };

    // 1. Instant hydration from localStorage on mount (0ms latency for iframe reload)
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`zyntix_preview_${subdomain}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          applySiteToDOM(parsed);
        }
      } catch (e) {}
    }

    // 2. Real-time postMessage listener
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'ZYNTIX_UPDATE_SITE' && e.data?.site) {
        applySiteToDOM(e.data.site);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [subdomain]);

  return null;
}
