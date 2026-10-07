import { describe, it, expect } from 'vitest';
import { Source, SourceType, ReliabilityState, LicenseState } from '../../src/entities/Source.js';
import { UrlValue } from '../../src/value-objects/URL.js';
import { ValidationError } from '@semburat/shared';

describe('Source', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    url: 'https://example.com/article',
    domain: 'example.com',
    title: 'Source Article Title',
    sourceType: SourceType.OFFICIAL,
  };

  it('should create a source with valid data', () => {
    const source = new Source(validParams);
    expect(source.id).toBe(validParams.id);
    expect(source.url.value).toBe('https://example.com/article');
    expect(source.domain).toBe('example.com');
    expect(source.title).toBe('Source Article Title');
    expect(source.sourceType).toBe(SourceType.OFFICIAL);
    expect(source.reliabilityState).toBe(ReliabilityState.UNVERIFIED);
    expect(source.licenseState).toBe(LicenseState.UNKNOWN);
  });

  it('should throw ValidationError for empty title', () => {
    expect(() => new Source({ ...validParams, title: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for empty domain', () => {
    expect(() => new Source({ ...validParams, domain: '' })).toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid URL', () => {
    expect(() => new Source({ ...validParams, url: 'not-a-url' })).toThrow(ValidationError);
  });

  it('should normalize URL (lowercase host)', () => {
    const source = new Source({ ...validParams, url: 'https://EXAMPLE.COM/Article' });
    expect(source.url.value).toBe('https://example.com/Article');
  });

  it('withReliability should return new Source with updated reliability', () => {
    const source = new Source(validParams);
    const newSource = source.withReliability(ReliabilityState.HIGH);
    expect(newSource.reliabilityState).toBe(ReliabilityState.HIGH);
  });

  it('withLicense should return new Source with updated license', () => {
    const source = new Source(validParams);
    const newSource = source.withLicense(LicenseState.LICENSED);
    expect(newSource.licenseState).toBe(LicenseState.LICENSED);
  });

  it('isHighReliability should return true for HIGH reliability', () => {
    const source = new Source({ ...validParams, reliabilityState: ReliabilityState.HIGH });
    expect(source.isHighReliability()).toBe(true);
  });

  it('isHighReliability should return false for MEDIUM reliability', () => {
    const source = new Source({ ...validParams, reliabilityState: ReliabilityState.MEDIUM });
    expect(source.isHighReliability()).toBe(false);
  });

  it('canBePublished should return false for UNKNOWN license', () => {
    const source = new Source({ ...validParams, licenseState: LicenseState.UNKNOWN });
    expect(source.canBePublished()).toBe(false);
  });

  it('canBePublished should return false for RESTRICTED license', () => {
    const source = new Source({ ...validParams, licenseState: LicenseState.RESTRICTED });
    expect(source.canBePublished()).toBe(false);
  });

  it('canBePublished should return true for LICENSED license', () => {
    const source = new Source({ ...validParams, licenseState: LicenseState.LICENSED });
    expect(source.canBePublished()).toBe(true);
  });

  it('canBePublished should return true for PUBLIC_DOMAIN license', () => {
    const source = new Source({ ...validParams, licenseState: LicenseState.PUBLIC_DOMAIN });
    expect(source.canBePublished()).toBe(true);
  });
});
