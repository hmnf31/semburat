import { describe, it, expect } from 'vitest';
import { Fact, VerificationStatus } from '../../src/entities/Fact.js';
import { ValidationError } from '@semburat/shared';

describe('Fact', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    articleId: '550e8400-e29b-41d4-a716-446655440001',
    statement: 'This is a factual statement that can be verified.',
  };

  it('should create a fact with valid data', () => {
    const fact = new Fact(validParams);
    expect(fact.id).toBe(validParams.id);
    expect(fact.articleId).toBe(validParams.articleId);
    expect(fact.statement).toBe('This is a factual statement that can be verified.');
    expect(fact.normalizedStatement).toBe('this is a factual statement that can be verified.');
    expect(fact.verificationStatus).toBe(VerificationStatus.UNVERIFIED);
    expect(fact.confidence).toBe(0);
  });

  it('should throw ValidationError for empty statement', () => {
    expect(() => new Fact({ ...validParams, statement: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for confidence out of range', () => {
    expect(() => new Fact({ ...validParams, confidence: -0.1 })).toThrow(ValidationError);
    expect(() => new Fact({ ...validParams, confidence: 1.1 })).toThrow(ValidationError);
  });

  it('withVerificationStatus should return new Fact with updated status', () => {
    const fact = new Fact(validParams);
    const newFact = fact.withVerificationStatus(VerificationStatus.VERIFIED);
    expect(newFact.verificationStatus).toBe(VerificationStatus.VERIFIED);
    expect(newFact.updatedAt).not.toBe(fact.updatedAt);
  });

  it('withConfidence should return new Fact with updated confidence', () => {
    const fact = new Fact(validParams);
    const newFact = fact.withConfidence(0.85);
    expect(newFact.confidence).toBe(0.85);
    expect(newFact.updatedAt).not.toBe(fact.updatedAt);
  });

  it('withConfidence should throw for invalid confidence', () => {
    const fact = new Fact(validParams);
    expect(() => fact.withConfidence(1.5)).toThrow(ValidationError);
  });
});
