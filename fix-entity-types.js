const fs = require('fs');
const path = require('path');

function fixEntity(filePath, imports, removeLines) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Add imports at the top
  if (imports) {
    const lines = content.split('\n');
    let insertIndex = 0;
    while (
      insertIndex < lines.length &&
      (lines[insertIndex].startsWith('import') ||
        lines[insertIndex].startsWith('export') ||
        lines[insertIndex].trim() === '')
    ) {
      insertIndex++;
    }
    lines.splice(insertIndex, 0, ...imports);
    content = lines.join('\n');
  }
  // Remove specific lines
  if (removeLines) {
    for (const pattern of removeLines) {
      content = content.replace(new RegExp(pattern, 'g'), '');
    }
  }
  fs.writeFileSync(filePath, content);
  console.log('Fixed:', filePath);
}

// Fix Article.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/Article.ts',
  ['import { ArticleId, ResearchId, AssetId, TopicId } from "../../packages/shared/src/types.js";'],
  [
    'export type ArticleId = string;\\n',
    'export type ResearchId = string;\\n',
    'export type AssetId = string;\\n',
    'export type TopicId = string;\\n',
  ]
);

// Fix Trend.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/Trend.ts',
  ['import { TrendId, TopicId } from "../../packages/shared/src/types.js";'],
  ['export type TrendId = string;\\n', 'export type TopicId = string;\\n']
);

// Fix Source.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/Source.ts',
  ['import { SourceId } from "../../packages/shared/src/types.js";'],
  ['export type SourceId = string;\\n']
);

// Fix Fact.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/Fact.ts',
  ['import { FactId, ArticleId } from "../../packages/shared/src/types.js";'],
  ['export type FactId = string;\\n', 'export type ArticleId = string;\\n']
);

// Fix FactEvidence.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/FactEvidence.ts',
  ['import { FactId, SourceId } from "../../packages/shared/src/types.js";'],
  ['export type FactId = string;\\n', 'export type SourceId = string;\\n']
);

// Fix Asset.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/Asset.ts',
  ['import { AssetId, ArticleId } from "../../packages/shared/src/types.js";'],
  ['export type AssetId = string;\\n', 'export type ArticleId = string;\\n']
);

// Fix ContentVariant.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/ContentVariant.ts',
  ['import { ContentVariantId, ArticleId, AssetId } from "../../packages/shared/src/types.js";'],
  [
    'export type ContentVariantId = string;\\n',
    'export type ArticleId = string;\\n',
    'export type AssetId = string;\\n',
  ]
);

// Fix PublishingJob.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/PublishingJob.ts',
  ['import { PublishingJobId, ContentVariantId } from "../../packages/shared/src/types.js";'],
  ['export type PublishingJobId = string;\\n', 'export type ContentVariantId = string;\\n']
);

// Fix Research.ts
fixEntity(
  'E:/semburat-project/packages/domain/src/entities/Research.ts',
  ['import { ResearchId, TrendId } from "../../packages/shared/src/types.js";'],
  ['export type ResearchId = string;\\n', 'export type TrendId = string;\\n']
);

console.log('Done fixing entity type imports');
