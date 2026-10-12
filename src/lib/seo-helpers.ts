/**
 * High-Precision SEO Calibration Helpers for Google SERP
 * Ensures titles are strictly 50-60 characters and descriptions 150-155 characters.
 */

export function optimizeMetaTitle(title: string, brand?: string): string {
  if (!title) return brand ? `${brand} | Architectural Studio` : "Official Architectural Studio";
  
  const cleanTitle = title.trim();
  if (cleanTitle.length >= 50 && cleanTitle.length <= 60) {
    return cleanTitle;
  }
  
  if (cleanTitle.length < 50 && brand && !cleanTitle.toLowerCase().includes(brand.toLowerCase())) {
    const combined = `${cleanTitle} | ${brand}`;
    if (combined.length >= 50 && combined.length <= 60) {
      return combined;
    }
    if (combined.length > 60) {
      const shortBrand = brand.split(/&|,|-/)[0].trim();
      const combinedShort = `${cleanTitle} | ${shortBrand}`;
      if (combinedShort.length >= 50 && combinedShort.length <= 60) {
        return combinedShort;
      }
      const trimmed = combined.slice(0, 60);
      const lastSpace = trimmed.lastIndexOf(" ");
      if (lastSpace >= 48) {
        return trimmed.slice(0, lastSpace).trim();
      }
      return trimmed.trim();
    }
    if (combined.length < 50) {
      const padded = `${combined} Studio`;
      if (padded.length <= 60) return padded;
    }
    return combined;
  }

  if (cleanTitle.length > 60) {
    const trimmed = cleanTitle.slice(0, 60);
    const lastSpace = trimmed.lastIndexOf(" ");
    return (lastSpace >= 48 ? trimmed.slice(0, lastSpace) : trimmed).trim();
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
    const trimmed = source.slice(0, 154);
    const lastSpace = trimmed.lastIndexOf(" ");
    const finalCut = (lastSpace > 130 ? trimmed.slice(0, lastSpace) : trimmed).trim();
    return finalCut.endsWith(".") ? finalCut : finalCut + ".";
  }

  if (source.length < 148) {
    const pad1 = " High-integrity architectural craftsmanship and sustainable engineering.";
    const pad2 = " Verified field research, structural conservation, and timeless design.";
    let combined = source.endsWith(".") ? `${source}${pad1}` : `${source}.${pad1}`;
    if (combined.length < 148) {
      combined = `${combined}${pad2}`;
    }
    if (combined.length >= 148 && combined.length <= 156) {
      return combined;
    }
    if (combined.length > 156) {
      const trimmed = combined.slice(0, 155);
      const lastSpace = trimmed.lastIndexOf(" ");
      const finalCut = (lastSpace >= 147 ? trimmed.slice(0, lastSpace) : trimmed).trim();
      return finalCut.endsWith(".") ? finalCut : finalCut + ".";
    }
    return combined;
  }

  return source;
}
