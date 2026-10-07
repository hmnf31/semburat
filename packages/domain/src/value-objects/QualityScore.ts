import { ValidationError } from '@semburat/shared';

export class QualityScore {
  public readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static fromNumber(input: number): QualityScore {
    if (!Number.isInteger(input)) {
      throw new ValidationError('Quality score must be an integer');
    }
    if (input < 0 || input > 100) {
      throw new ValidationError('Quality score must be between 0 and 100');
    }
    return new QualityScore(input);
  }

  getValue(): number {
    return this.value;
  }

  isPassing(): boolean {
    return this.value >= 75;
  }

  isAutoPublishable(): boolean {
    return this.value >= 90;
  }

  isRejected(): boolean {
    return this.value < 60;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: QualityScore): boolean {
    return this.value === other.value;
  }
}
