'use client';
import { useEffect } from 'react';

interface SiteLiveSyncProps {
  subdomain: string;
}

export function SiteLiveSync({ subdomain }: SiteLiveSyncProps) {
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'ZYNTIX_UPDATE_SITE' && e.data?.site) {
        const site = e.data.site;
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
        if (site.name) {
          const nameEls = document.querySelectorAll('[data-site-name]');
          nameEls.forEach((el) => {
            el.textContent = site.name;
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [subdomain]);

  return null;
}
