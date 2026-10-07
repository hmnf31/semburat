import { ContentVariant } from '../entities/ContentVariant.js';

export interface Publisher {
  publish(variant: ContentVariant): Promise<{ externalId: string; url: string }>;
  delete(externalId: string): Promise<void>;
}
