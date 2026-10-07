import { describe, it, expect } from 'vitest';
import { ContentVariant, Platform, ApprovalState } from '../../src/entities/ContentVariant.js';
import { ValidationError } from '@semburat/shared';

describe('ContentVariant', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    articleId: '550e8400-e29b-41d4-a716-446655440001',
    platform: Platform.WEB,
    format: 'html',
    content: '<p>Article content here</p>',
  };

  it('should create a content variant with valid data', () => {
    const variant = new ContentVariant(validParams);
    expect(variant.id).toBe(validParams.id);
    expect(variant.articleId).toBe(validParams.articleId);
    expect(variant.platform).toBe(Platform.WEB);
    expect(variant.format).toBe('html');
    expect(variant.content).toBe('<p>Article content here</p>');
    expect(variant.assetIds).toEqual([]);
    expect(variant.approvalState).toBe(ApprovalState.PENDING);
    expect(variant.generationMetadata).toBe('{}');
  });

  it('should throw ValidationError for empty content', () => {
    expect(() => new ContentVariant({ ...validParams, content: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for empty format', () => {
    expect(() => new ContentVariant({ ...validParams, format: '' })).toThrow(ValidationError);
  });

  it('withApprovalState should return new ContentVariant with updated state', () => {
    const variant = new ContentVariant(validParams);
    const newVariant = variant.withApprovalState(ApprovalState.APPROVED);
    expect(newVariant.approvalState).toBe(ApprovalState.APPROVED);
  });

  it('markPublished should set approvalState to APPROVED and set publishedAt', () => {
    const variant = new ContentVariant(validParams);
    const published = variant.markPublished();
    expect(published.approvalState).toBe(ApprovalState.APPROVED);
    expect(published.publishedAt).toBeInstanceOf(Date);
  });
});
