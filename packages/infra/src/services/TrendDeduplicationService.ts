export class TrendDeduplicationService {
  deduplicate(
    trends: Array<{ normalizedKey: string; title: string }>
  ): Array<{ normalizedKey: string; title: string; isDuplicate: boolean }> {
    const seen = new Set<string>();
    return trends.map((t) => {
      const isDup = seen.has(t.normalizedKey);
      seen.add(t.normalizedKey);
      return { ...t, isDuplicate: isDup };
    });
  }
}
