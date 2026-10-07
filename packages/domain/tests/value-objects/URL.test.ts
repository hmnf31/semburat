import { describe, it, expect } from 'vitest';
import { UrlValue } from '../../src/value-objects/URL.js';
import { ValidationError } from '@semburat/shared';

describe('UrlValue', () => {
  it('should create URL from valid string', () => {
    const url = UrlValue.fromString('https://example.com/path?query=1');
    expect(url.value).toBe('https://example.com/path?query=1');
  });

  it('should normalize hostname to lowercase', () => {
    const url = UrlValue.fromString('https://EXAMPLE.COM/path');
    expect(url.value).toBe('https://example.com/path');
  });

  it('should trim whitespace', () => {
    const url = UrlValue.fromString('  https://example.com/path  ');
    expect(url.value).toBe('https://example.com/path');
  });

  it('should throw for empty string', () => {
    expect(() => UrlValue.fromString('')).toThrow(ValidationError);
  });

  it('should throw for invalid URL format', () => {
    expect(() => UrlValue.fromString('not-a-url')).toThrow(ValidationError);
  });

  it('should throw for non-http/https protocol', () => {
    expect(() => UrlValue.fromString('ftp://example.com/file')).toThrow(ValidationError);
    expect(() => UrlValue.fromString('javascript:alert(1)')).toThrow(ValidationError);
  });

  it('getHostname should return hostname', () => {
    const url = UrlValue.fromString('https://example.com/path');
    expect(url.getHostname()).toBe('example.com');
  });

  it('getProtocol should return protocol', () => {
    const url = UrlValue.fromString('https://example.com/path');
    expect(url.getProtocol()).toBe('https:');
  });

  it('toString should return the value', () => {
    const url = UrlValue.fromString('https://example.com/path');
    expect(url.toString()).toBe('https://example.com/path');
  });

  it('equals should compare values', () => {
    const url1 = UrlValue.fromString('https://example.com/path');
    const url2 = UrlValue.fromString('https://example.com/path');
    const url3 = UrlValue.fromString('https://other.com/path');
    expect(url1.equals(url2)).toBe(true);
    expect(url1.equals(url3)).toBe(false);
  });
});
