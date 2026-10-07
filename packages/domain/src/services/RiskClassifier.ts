import { RiskLevel } from '../value-objects/RiskLevel.js';

export class RiskClassifier {
  private readonly highRiskCategories = [
    'crime',
    'health',
    'politics',
    'finance',
    'legal',
    'disaster',
    'terrorism',
    'corruption',
    'election',
    'pandemic',
    'war',
  ];

  private readonly highRiskKeywords = [
    'kematian',
    'mati',
    'terluka',
    'kebakaran',
    'bencana',
    'kejahatan',
    'pembunuhan',
    'pencurian',
    'penipuan',
    'korupsi',
    'skandal',
    'kontroversi',
    'protes',
    'demo',
    'hukum',
    'pengadilan',
    'tahanan',
    'saham',
    'investasi',
    'penipuan investasi',
    'kesehatan',
    'virus',
    'wabah',
    'pandemi',
    'vaksin',
    'efek samping',
    'overdosis',
  ];

  classify(category: string, content: string): RiskLevel {
    const categoryLower = category.toLowerCase();
    const contentLower = content.toLowerCase();

    if (this.highRiskCategories.some((c) => categoryLower.includes(c))) {
      return RiskLevel.fromString('HIGH');
    }

    const keywordMatches = this.highRiskKeywords.filter((k) => contentLower.includes(k)).length;
    if (keywordMatches >= 3) {
      return RiskLevel.fromString('HIGH');
    }
    if (keywordMatches >= 1) {
      return RiskLevel.fromString('MEDIUM');
    }

    return RiskLevel.fromString('LOW');
  }
}
