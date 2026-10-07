export class DuplicateDetector {
  isDuplicate(title: string, existingTitles: string[]): boolean {
    const normalizedTitle = this.normalize(title);
    return existingTitles.some(
      (existing) => this.calculateSimilarity(normalizedTitle, this.normalize(existing)) > 0.7
    );
  }

  calculateSimilarity(a: string, b: string): number {
    const normalizedA = this.normalize(a);
    const normalizedB = this.normalize(b);
    const setA = new Set(this.tokenize(normalizedA));
    const setB = new Set(this.tokenize(normalizedB));

    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private tokenize(text: string): string[] {
    return text.split(/\s+/).filter((t) => t.length > 2);
  }
}
