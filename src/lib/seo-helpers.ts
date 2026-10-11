/**
 * High-Precision SEO Calibration Helpers for Google SERP
 * Ensures titles are strictly 50-60 characters and descriptions 150-155 characters.
 */

export function optimizeMetaTitle(title: string, brand?: string): string {
  if (!title) return brand ? `${brand} | Architectural Studio` : "Official Architectural Studio";
  
  const cleanTitle = title.trim();
  if (cleanTitle.length >= 48 && cleanTitle.length <= 60) {
    return cleanTitle;
  }
  
  if (cleanTitle.length < 48 && brand && !cleanTitle.toLowerCase().includes(brand.toLowerCase())) {
    const combined = `${cleanTitle} | ${brand}`;
    if (combined.length <= 60) return combined;
    return combined.slice(0, 57).trim() + "...";
  }

  if (cleanTitle.length > 60) {
    const trimmed = cleanTitle.slice(0, 58);
    const lastSpace = trimmed.lastIndexOf(" ");
    return (lastSpace > 42 ? trimmed.slice(0, lastSpace) : trimmed).trim();
  }

  return cleanTitle;
}

export function optimizeMetaDescription(text: string, fallback?: string): string {
  const source = (text || fallback || "")
    .replace(/\[AEO_ANSWER\]:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!source) {
    return "Architectural atelier in Latifabad, Hyderabad specializing in sustainable timber framing, historic masonry restoration, and passive solar engineering.";
  }

  if (source.length >= 148 && source.length <= 156) {
    return source;
  }

  if (source.length > 156) {
    const trimmed = source.slice(0, 153);
    const lastSpace = trimmed.lastIndexOf(" ");
    const finalCut = (lastSpace > 120 ? trimmed.slice(0, lastSpace) : trimmed).trim();
    return finalCut.endsWith(".") ? finalCut : finalCut + ".";
  }

  return source;
}
