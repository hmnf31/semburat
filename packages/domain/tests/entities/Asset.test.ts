import { describe, it, expect } from 'vitest';
import { Asset, AssetType } from '../../src/entities/Asset.js';
import { LicenseState } from '../../src/entities/Source.js';
import { ValidationError } from '@semburat/shared';

describe('Asset', () => {
  const validParams = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    articleId: '550e8400-e29b-41d4-a716-446655440001',
    type: AssetType.IMAGE,
    storageKey: 'assets/image-123.jpg',
  };

  it('should create an asset with valid data', () => {
    const asset = new Asset(validParams);
    expect(asset.id).toBe(validParams.id);
    expect(asset.articleId).toBe(validParams.articleId);
    expect(asset.type).toBe(AssetType.IMAGE);
    expect(asset.storageKey).toBe('assets/image-123.jpg');
    expect(asset.licenseState).toBe(LicenseState.UNKNOWN);
    expect(asset.metadataJson).toBe('{}');
  });

  it('should throw ValidationError for empty storageKey', () => {
    expect(() => new Asset({ ...validParams, storageKey: '' })).toThrow(ValidationError);
  });

  it('withLicense should return new Asset with updated license', () => {
    const asset = new Asset(validParams);
    const newAsset = asset.withLicense(LicenseState.LICENSED);
    expect(newAsset.licenseState).toBe(LicenseState.LICENSED);
  });

  it('withCredit should return new Asset with updated credit', () => {
    const asset = new Asset(validParams);
    const newAsset = asset.withCredit('Photo by John Doe');
    expect(newAsset.creditText).toBe('Photo by John Doe');
  });

  it('canBePublished should return false for UNKNOWN license', () => {
    const asset = new Asset({ ...validParams, licenseState: LicenseState.UNKNOWN });
    expect(asset.canBePublished()).toBe(false);
  });

  it('canBePublished should return false for RESTRICTED license', () => {
    const asset = new Asset({ ...validParams, licenseState: LicenseState.RESTRICTED });
    expect(asset.canBePublished()).toBe(false);
  });

  it('canBePublished should return true for LICENSED license', () => {
    const asset = new Asset({ ...validParams, licenseState: LicenseState.LICENSED });
    expect(asset.canBePublished()).toBe(true);
  });
});
