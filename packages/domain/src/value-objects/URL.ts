import { ValidationError } from '@semburat/shared';

export class UrlValue {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static fromString(input: string): UrlValue {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new ValidationError('URL cannot be empty');
    }

    let url: globalThis.URL;
    try {
      url = new globalThis.URL(trimmed);
    } catch {
      throw new ValidationError('Invalid URL format');
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new ValidationError('URL must use http or https protocol');
    }

    const normalized =
      url.protocol + '//' + url.hostname.toLowerCase() + url.pathname + url.search + url.hash;
    return new UrlValue(normalized);
  }

  toString(): string {
    return this.value;
  }

  getHostname(): string {
    try {
      return new globalThis.URL(this.value).hostname;
    } catch {
      return '';
    }
  }

  getProtocol(): string {
    try {
      return new globalThis.URL(this.value).protocol;
    } catch {
      return '';
    }
  }

  equals(other: UrlValue): boolean {
    return this.value === other.value;
  }
}
