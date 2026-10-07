import { ValidationError } from '@semburat/shared';

export class Slug {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static fromString(input: string): Slug {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) {
      throw new ValidationError('Slug cannot be empty');
    }
    if (trimmed.length > 100) {
      throw new ValidationError('Slug cannot exceed 100 characters');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
      throw new ValidationError(
        'Slug must contain only lowercase alphanumeric characters and hyphens, no consecutive hyphens'
      );
    }
    if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
      throw new ValidationError('Slug cannot start or end with a hyphen');
    }
    if (trimmed.includes('--')) {
      throw new ValidationError('Slug cannot contain consecutive hyphens');
    }
    return new Slug(trimmed);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
