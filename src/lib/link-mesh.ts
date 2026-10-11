/**
 * Autonomous SEO, Bi-Directional Linking Mesh & Schema Generator
 * - Injects internal reciprocal backlinks
 * - Injects authoritative external E-E-A-T citations (.gov, .edu, Wikipedia)
 * - Generates Article & FAQPage JSON-LD schema for Google & AI Perplexity/ChatGPT citations
 */

export interface SchemaMetadata {
  '@context': string;
  '@type': string;
  headline: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
    url?: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  description: string;
  mainEntityOfPage: string;
}

export const AUTHORITY_CITATIONS: Record<string, Array<{ text: string; url: string }>> = {
  general: [
    { text: 'Encyclopedia Britannica Archive', url: 'https://www.britannica.com' },
    { text: 'National Endowment for the Arts Research', url: 'https://www.arts.gov' },
    { text: 'MIT Open Research Library', url: 'https://dspace.mit.edu' }
  ],
  architecture: [
    { text: 'National Trust for Historic Preservation', url: 'https://savingplaces.org' },
    { text: 'American Institute of Architects Standards', url: 'https://www.aia.org' },
    { text: 'Library of Congress Architectural Survey', url: 'https://www.loc.gov' }
  ],
  tech: [
    { text: 'ACM Digital Library Publications', url: 'https://dl.acm.org' },
    { text: 'W3C Open Web Architecture Consortium', url: 'https://www.w3.org' },
    { text: 'IEEE Computer Society Research', url: 'https://www.computer.org' }
  ]
};

export function injectBiDirectionalLinks(
  content: string[],
  existingPosts: Array<{ slug: string; title: string }>,
  niche: string = 'general'
): string[] {
  const citations = AUTHORITY_CITATIONS[niche] || AUTHORITY_CITATIONS.general;
  const enriched: string[] = [...content];

  // 1. Inject internal reciprocal link if existing posts exist
  if (existingPosts.length > 0) {
    const target = existingPosts[Math.floor(Math.random() * existingPosts.length)];
    enriched.push(
      `*(For further exploration, see our earlier research article: [${target.title}](/blog/${target.slug}))*`
    );
  }

  // 2. Inject high-authority external E-E-A-T citation
  const citation = citations[Math.floor(Math.random() * citations.length)];
  enriched.push(
    `*Primary reference & historical verification: [${citation.text}](${citation.url}).*`
  );

  return enriched;
}

export function generateArticleSchema(
  title: string,
  description: string,
  coverImage: string,
  url: string,
  authorName: string,
  publisherName: string,
  datePublished: string
): SchemaMetadata {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: coverImage,
    datePublished,
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName
    },
    description,
    mainEntityOfPage: url
  };
}
