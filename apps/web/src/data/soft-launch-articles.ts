import { explainer01 } from './articles/explainer-01';
import { explainer02 } from './articles/explainer-02';
import { gaming01 } from './articles/gaming-01';
import { gaming02 } from './articles/gaming-02';
import { gaming03 } from './articles/gaming-03';
import { tech01 } from './articles/tech-01';
import { tech02 } from './articles/tech-02';
import { tech03 } from './articles/tech-03';
import { viral01 } from './articles/viral-01';
import { viral02 } from './articles/viral-02';
import type { SoftLaunchArticle } from './article-types';

export type {
  SoftLaunchArticle,
  SoftLaunchAsset,
  SoftLaunchFaq,
  SoftLaunchRiskLevel,
  SoftLaunchSource,
  SoftLaunchStatus,
} from './article-types';

export const softLaunchArticles: SoftLaunchArticle[] = [
  viral01,
  viral02,
  tech01,
  tech02,
  tech03,
  gaming01,
  gaming02,
  gaming03,
  explainer01,
  explainer02,
];
