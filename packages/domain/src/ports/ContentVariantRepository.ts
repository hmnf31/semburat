import type { ContentVariant } from '../entities/ContentVariant.js';
import type { ApprovalState } from '../entities/ContentVariant.js';

export interface ContentVariantRepository {
  insert(variant: ContentVariant): Promise<void>;
  findById(id: string): Promise<ContentVariant | null>;
  findByArticleId(articleId: string): Promise<ContentVariant[]>;
  updateApprovalState(id: string, state: ApprovalState): Promise<void>;
}
