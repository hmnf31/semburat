const fs = require('fs');

function fixEntity(filePath, imports, enumStartLine) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Find where to insert imports (after existing imports, before exports)
  let insertIndex = 0;
  while (
    insertIndex < lines.length &&
    (lines[insertIndex].startsWith('import') || lines[insertIndex].trim() === '')
  ) {
    insertIndex++;
  }

  // Insert new imports
  lines.splice(insertIndex, 0, ...imports);

  // Remove any duplicate export type lines that were added incorrectly
  const cleaned = lines.filter((line) => {
    const trimmed = line.trim();
    return !trimmed.startsWith('export type ') || !trimmed.endsWith(' = string;');
  });

  fs.writeFileSync(filePath, cleaned.join('\n'));
  console.log('Fixed:', filePath);
}

const sharedTypesImport = [
  'import { ArticleId, ResearchId, AssetId, TopicId, TrendId, SourceId, FactId, ContentVariantId, PublishingJobId, ResearchId } from "../../packages/shared/src/types.js";',
];

fixEntity('E:/semburat-project/packages/domain/src/entities/Article.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/Trend.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/Source.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/Fact.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/FactEvidence.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/Asset.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/ContentVariant.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/PublishingJob.ts', sharedTypesImport);
fixEntity('E:/semburat-project/packages/domain/src/entities/Research.ts', sharedTypesImport);

console.log('Done fixing entity imports');
