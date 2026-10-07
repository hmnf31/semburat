import { describe, it, expect } from 'vitest';
import { Slug } from '../../src/value-objects/Slug.js';
import { ValidationError } from '@semburat/shared';

describe('Slug', () => {
  it('should create slug from valid string', () => {
    const slug = Slug.fromString('valid-slug-name');
    expect(slug.value).toBe('valid-slug-name');
  });

  it('should lowercase the slug', () => {
    const slug = Slug.fromString('UPPERCASE-SLUG');
    expect(slug.value).toBe('uppercase-slug');
  });

  it('should trim whitespace', () => {
    const slug = Slug.fromString('  trimmed-slug  ');
    expect(slug.value).toBe('trimmed-slug');
  });

  it('should throw for empty string', () => {
    expect(() => Slug.fromString('')).toThrow(ValidationError);
  });

  it('should throw for string with only whitespace', () => {
    expect(() => Slug.fromString('   ')).toThrow(ValidationError);
  });

  it('should throw for slug longer than 100 characters', () => {
    expect(() => Slug.fromString('a'.repeat(101))).toThrow(ValidationError);
  });

  it('should throw for slug starting with hyphen', () => {
    expect(() => Slug.fromString('-invalid')).toThrow(ValidationError);
  });

  it('should throw for slug ending with hyphen', () => {
    expect(() => Slug.fromString('invalid-')).toThrow(ValidationError);
  });

  it('should throw for consecutive hyphens', () => {
    expect(() => Slug.fromString('invalid--slug')).toThrow(ValidationError);
  });

  it('should throw for special characters', () => {
    expect(() => Slug.fromString('invalid@slug')).toThrow(ValidationError);
    expect(() => Slug.fromString('invalid_slug')).toThrow(ValidationError);
    expect(() => Slug.fromString('invalid slug')).toThrow(ValidationError);
  });

  it('toString should return the value', () => {
    const slug = Slug.fromString('test-slug');
    expect(slug.toString()).toBe('test-slug');
  });

  it('equals should compare values', () => {
    const slug1 = Slug.fromString('test-slug');
    const slug2 = Slug.fromString('test-slug');
    const slug3 = Slug.fromString('other-slug');
    expect(slug1.equals(slug2)).toBe(true);
    expect(slug1.equals(slug3)).toBe(false);
  });
});
