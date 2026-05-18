const htmlEntities: Record<string, string> = {
  amp: "&",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  apos: "'",
};

export const cleanPackageCardText = (value: unknown) => {
  if (typeof value !== "string") return "";

  const decodeEntities = (text: string) =>
    text.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (match, entity: string) => {
      const key = entity.toLowerCase();
      if (key.startsWith("#x")) {
        const codePoint = parseInt(key.slice(2), 16);
        return Number.isNaN(codePoint) ? match : String.fromCharCode(codePoint);
      }
      if (key.startsWith("#")) {
        const codePoint = parseInt(key.slice(1), 10);
        return Number.isNaN(codePoint) ? match : String.fromCharCode(codePoint);
      }
      return htmlEntities[key] ?? match;
    });

  const decoded = decodeEntities(decodeEntities(value));

  return decoded
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const getPackageCardPoints = (pkg: { cardKeyPoints?: unknown; highlights?: unknown }) => {
  const keyPoints = Array.isArray(pkg.cardKeyPoints) ? pkg.cardKeyPoints : [];
  const highlights = Array.isArray(pkg.highlights) ? pkg.highlights : [];
  const cleanKeyPoints = keyPoints.map(cleanPackageCardText).filter(Boolean);
  const cleanHighlights = highlights.map(cleanPackageCardText).filter(Boolean);

  return (cleanKeyPoints.length > 0 ? cleanKeyPoints : cleanHighlights).slice(0, 3);
};
