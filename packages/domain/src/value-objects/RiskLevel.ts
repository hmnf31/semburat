import { ValidationError } from '@semburat/shared';

export type RiskLevelValue = 'LOW' | 'MEDIUM' | 'HIGH';

export class RiskLevel {
  public readonly value: RiskLevelValue;

  public constructor(value: RiskLevelValue) {
    this.value = value;
  }

  static fromString(input: string): RiskLevel {
    const upper = input.trim().toUpperCase();
    if (upper === 'LOW' || upper === 'MEDIUM' || upper === 'HIGH') {
      return new RiskLevel(upper);
    }
    throw new ValidationError(`Invalid risk level: ${input}. Must be LOW, MEDIUM, or HIGH`);
  }

  static fromScore(score: number): RiskLevel {
    if (score >= 70) return new RiskLevel('HIGH');
    if (score >= 40) return new RiskLevel('MEDIUM');
    return new RiskLevel('LOW');
  }

  isHighRisk(): boolean {
    return this.value === 'HIGH';
  }

  toString(): string {
    return this.value;
  }

  equals(other: RiskLevel): boolean {
    return this.value === other.value;
  }
}
