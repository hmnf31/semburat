// packages/shared/src/types.ts
import { z } from 'zod';

export const ArticleIdSchema = z.string().uuid();
export type ArticleId = z.infer<typeof ArticleIdSchema>;

export const TrendIdSchema = z.string().uuid();
export type TrendId = z.infer<typeof TrendIdSchema>;

export const SourceIdSchema = z.string().uuid();
export type SourceId = z.infer<typeof SourceIdSchema>;

export const FactIdSchema = z.string().uuid();
export type FactId = z.infer<typeof FactIdSchema>;

export const AssetIdSchema = z.string().uuid();
export type AssetId = z.infer<typeof AssetIdSchema>;

export const ContentVariantIdSchema = z.string().uuid();
export type ContentVariantId = z.infer<typeof ContentVariantIdSchema>;

export const PublishingJobIdSchema = z.string().uuid();
export type PublishingJobId = z.infer<typeof PublishingJobIdSchema>;

export const ResearchIdSchema = z.string().uuid();
export type ResearchId = z.infer<typeof ResearchIdSchema>;

export const TopicIdSchema = z.string().uuid();
export type TopicId = z.infer<typeof TopicIdSchema>;

export const AnalyticsEventIdSchema = z.string().uuid();
export type AnalyticsEventId = z.infer<typeof AnalyticsEventIdSchema>;

export const AuditLogIdSchema = z.string().uuid();
export type AuditLogId = z.infer<typeof AuditLogIdSchema>;

export enum Status {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PARTIAL = 'partial',
  VERIFIED = 'verified',
  FAILED = 'failed',
}

export enum Platform {
  WEB = 'web',
  TELEGRAM = 'telegram',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  LINKEDIN = 'linkedin',
}

export const IDSchemas = {
  ArticleId: ArticleIdSchema,
  TrendId: TrendIdSchema,
  SourceId: SourceIdSchema,
  FactId: FactIdSchema,
  AssetId: AssetIdSchema,
  ContentVariantId: ContentVariantIdSchema,
  PublishingJobId: PublishingJobIdSchema,
  ResearchId: ResearchIdSchema,
  TopicId: TopicIdSchema,
  AnalyticsEventId: AnalyticsEventIdSchema,
  AuditLogId: AuditLogIdSchema,
} as const;
