import { describe, it, expect } from 'vitest';
import { Research, ResearchStatus } from '../../src/entities/Research.js';
import { ValidationError } from '@semburat/shared';

describe('Research', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    trendId: '550e8400-e29b-41d4-a716-446655440001',
    summary: 'Research summary with enough detail to be valid.',
  };

  it('should create research with valid data', () => {
    const research = new Research(validParams);
    expect(research.id).toBe(validParams.id);
    expect(research.trendId).toBe(validParams.trendId);
    expect(research.summary).toBe('Research summary with enough detail to be valid.');
    expect(research.factsJson).toBe('[]');
    expect(research.claimsJson).toBe('[]');
    expect(research.conflictsJson).toBe('[]');
    expect(research.confidenceScore).toBe(0);
    expect(research.status).toBe(ResearchStatus.PENDING);
  });

  it('should throw ValidationError for empty summary', () => {
    expect(() => new Research({ ...validParams, summary: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for confidenceScore out of range', () => {
    expect(() => new Research({ ...validParams, confidenceScore: -0.1 })).toThrow(ValidationError);
    expect(() => new Research({ ...validParams, confidenceScore: 1.1 })).toThrow(ValidationError);
  });

  it('withStatus should return new Research with updated status', () => {
    const research = new Research(validParams);
    const newResearch = research.withStatus(ResearchStatus.IN_PROGRESS);
    expect(newResearch.status).toBe(ResearchStatus.IN_PROGRESS);
    expect(newResearch.updatedAt).not.toBe(research.updatedAt);
  });
});
