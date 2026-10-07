import { describe, it, expect } from 'vitest';
import { RiskLevel } from '../../src/value-objects/RiskLevel.js';
import { ValidationError } from '@semburat/shared';

describe('RiskLevel', () => {
  it('should create LOW risk level', () => {
    const risk = RiskLevel.fromString('low');
    expect(risk.value).toBe('LOW');
  });

  it('should create MEDIUM risk level', () => {
    const risk = RiskLevel.fromString('medium');
    expect(risk.value).toBe('MEDIUM');
  });

  it('should create HIGH risk level', () => {
    const risk = RiskLevel.fromString('high');
    expect(risk.value).toBe('HIGH');
  });

  it('should be case insensitive', () => {
    expect(RiskLevel.fromString('Low').value).toBe('LOW');
    expect(RiskLevel.fromString('Medium').value).toBe('MEDIUM');
    expect(RiskLevel.fromString('High').value).toBe('HIGH');
  });

  it('should throw for invalid risk level', () => {
    expect(() => RiskLevel.fromString('critical')).toThrow(ValidationError);
    expect(() => RiskLevel.fromString('invalid')).toThrow(ValidationError);
  });

  it('fromScore should return HIGH for score >= 70', () => {
    expect(RiskLevel.fromScore(70).value).toBe('HIGH');
    expect(RiskLevel.fromScore(100).value).toBe('HIGH');
  });

  it('fromScore should return MEDIUM for score >= 40 and < 70', () => {
    expect(RiskLevel.fromScore(40).value).toBe('MEDIUM');
    expect(RiskLevel.fromScore(69).value).toBe('MEDIUM');
  });

  it('fromScore should return LOW for score < 40', () => {
    expect(RiskLevel.fromScore(0).value).toBe('LOW');
    expect(RiskLevel.fromScore(39).value).toBe('LOW');
  });

  it('isHighRisk should return true for HIGH', () => {
    expect(RiskLevel.fromString('HIGH').isHighRisk()).toBe(true);
  });

  it('isHighRisk should return false for MEDIUM and LOW', () => {
    expect(RiskLevel.fromString('MEDIUM').isHighRisk()).toBe(false);
    expect(RiskLevel.fromString('LOW').isHighRisk()).toBe(false);
  });

  it('toString should return the value', () => {
    expect(RiskLevel.fromString('HIGH').toString()).toBe('HIGH');
  });

  it('equals should compare values', () => {
    const risk1 = RiskLevel.fromString('HIGH');
    const risk2 = RiskLevel.fromString('HIGH');
    const risk3 = RiskLevel.fromString('LOW');
    expect(risk1.equals(risk2)).toBe(true);
    expect(risk1.equals(risk3)).toBe(false);
  });
});
