const fs = require('fs');
const content = `import { describe, it, expect } from "vitest";
import { FactVerifier } from "../../src/services/FactVerifier.js";
import { FactEvidence, SupportType } from "../../src/entities/FactEvidence.js";
import { VerificationStatus } from "../../src/entities/Fact.js";

describe("FactVerifier", () => {
  const verifier = new FactVerifier();

  const createEvidence = (params) => new FactEvidence({
    factId: params.factId,
    sourceId: params.sourceId,
    evidenceText: params.evidenceText,
    supportType: params.supportType,
    confidence: params.confidence,
  });

  it("should return UNVERIFIED for no evidence", () => {
    const result = verifier.verifyClaim("Some claim", []);
    expect(result.status).toBe(VerificationStatus.UNVERIFIED);
    expect(result.confidence).toBe(0);
  });

  it("should return CONTRADICTED when contradicting evidence is stronger", () => {
    const evidence = [
      createEvidence({ factId: "f1", sourceId: "s1", evidenceText: "Supports", supportType: SupportType.SUPPORTS, confidence: 0.5 }),
      createEvidence({ factId: "f1", sourceId: "s2", evidenceText: "Contradicts", supportType: SupportType.CONTRADICTS, confidence: 0.8 }),
    ];
    const result = verifier.verifyClaim("Some claim", evidence);
    expect(result.status).toBe(VerificationStatus.CONTRADICTED);
    expect(result.confidence).toBe(0.8);
  });

  it("should return VERIFIED when supporting evidence is strong", () => {
    const evidence = [
      createEvidence({ factId: "f1", sourceId: "s1", evidenceText: "Supports", supportType: SupportType.SUPPORTS, confidence: 0.8 }),
      createEvidence({ factId: "f1", sourceId: "s2", evidenceText: "Supports", supportType: SupportType.SUPPORTS, confidence: 0.7 }),
    ];
    const result = verifier.verifyClaim("Some claim", evidence);
    expect(result.status).toBe(VerificationStatus.VERIFIED);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it("should return PARTIALLY_VERIFIED for partial support", () => {
    const evidence = [
      createEvidence({ factId: "f1", sourceId: "s1", evidenceText: "Partial", supportType: SupportType.PARTIAL, confidence: 0.6 }),
    ];
    const result = verifier.verifyClaim("Some claim", evidence);
    expect(result.status).toBe(VerificationStatus.PARTIALLY_VERIFIED);
  });

  it("should return NEEDS_REVIEW for weak support", () => {
    const evidence = [
      createEvidence({ factId: "f1", sourceId: "s1", evidenceText: "Weak support", supportType: SupportType.SUPPORTS, confidence: 0.5 }),
    ];
    const result = verifier.verifyClaim("Some claim", evidence);
    expect(result.status).toBe(VerificationStatus.NEEDS_REVIEW);
  });

  it("should return UNVERIFIED for neutral evidence only", () => {
    const evidence = [
      createEvidence({ factId: "f1", sourceId: "s1", evidenceText: "Neutral", supportType: SupportType.NEUTRAL, confidence: 0.5 }),
    ];
    const result = verifier.verifyClaim("Some claim", evidence);
    expect(result.status).toBe(VerificationStatus.UNVERIFIED);
  });
});
`;
fs.writeFileSync(
  'E:/semburat-project/packages/domain/tests/services/FactVerifier.test.ts',
  content
);
console.log('FactVerifier.test.ts fixed');
