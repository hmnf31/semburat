export class TrendNormalizationService {
  normalize(
    candidates: Array<{ title: string; url: string; source: string }>
  ): Array<{ title: string; normalizedKey: string; sourceUrls: string[] }> {
    const groups = new Map<string, { title: string; urls: Set<string> }>();
    for (const c of candidates) {
      const key = c.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      if (!groups.has(key)) {
        groups.set(key, { title: c.title, urls: new Set() });
      }
      groups.get(key)!.urls.add(c.url);
    }
    return Array.from(groups.entries()).map(([key, val]) => ({
      title: val.title,
      normalizedKey: key,
      sourceUrls: Array.from(val.urls),
    }));
  }
}
