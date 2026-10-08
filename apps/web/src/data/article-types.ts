export type SoftLaunchRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type SoftLaunchStatus =
  | 'draft'
  | 'researching'
  | 'verified'
  | 'editorial_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'archived'
  | 'rejected'
  | 'needs_research'
  | 'needs_asset'
  | 'needs_license'
  | 'needs_review';

export interface SoftLaunchSource {
  title: string;
  url: string;
  accessedAt: string;
}

export interface SoftLaunchAsset {
  id: string;
  type: 'image' | 'video';
  title: string;
  license: string;
  credit: string;
  sourceUrl?: string;
}

export interface SoftLaunchFaq {
  question: string;
  answer: string;
}

export interface SoftLaunchArticle {
  id: string;
  slug: string;
  title: string;
  dek: string;
  summary: string;
  body: string;
  category: string;
  subcategory: string;
  status: SoftLaunchStatus;
  riskLevel: SoftLaunchRiskLevel;
  qualityScore: number;
  publishedAt: string;
  sources: SoftLaunchSource[];
  assets: SoftLaunchAsset[];
  keyPoints: string[];
  faq: SoftLaunchFaq[];
}
