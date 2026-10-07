import { describe, it, expect } from 'vitest';
import { QualityScore } from '../../src/value-objects/QualityScore.js';
import { ValidationError } from '@semburat/shared';

describe('QualityScore', () => {
  it('should create quality score from valid number', () => {
    const score = QualityScore.fromNumber(85);
    expect(score.value).toBe(85);
  });

  it('should throw for non-integer', () => {
    expect(() => QualityScore.fromNumber(85.5)).toThrow(ValidationError);
  });

  it('should throw for negative number', () => {
    expect(() => QualityScore.fromNumber(-1)).toThrow(ValidationError);
  });

  it('should throw for number > 100', () => {
    expect(() => QualityScore.fromNumber(101)).toThrow(ValidationError);
  });

  it('getValue should return the value', () => {
    const score = QualityScore.fromNumber(75);
    expect(score.getValue()).toBe(75);
  });

  it('isPassing should return true for score >= 75', () => {
    expect(QualityScore.fromNumber(75).isPassing()).toBe(true);
    expect(QualityScore.fromNumber(100).isPassing()).toBe(true);
  });

  it('isPassing should return false for score < 75', () => {
    expect(QualityScore.fromNumber(74).isPassing()).toBe(false);
    expect(QualityScore.fromNumber(0).isPassing()).toBe(false);
  });

  it('isAutoPublishable should return true for score >= 90', () => {
    expect(QualityScore.fromNumber(90).isAutoPublishable()).toBe(true);
    expect(QualityScore.fromNumber(100).isAutoPublishable()).toBe(true);
  });

  it('isAutoPublishable should return false for score < 90', () => {
    expect(QualityScore.fromNumber(89).isAutoPublishable()).toBe(false);
  });

  it('isRejected should return true for score < 60', () => {
    expect(QualityScore.fromNumber(59).isRejected()).toBe(true);
    expect(QualityScore.fromNumber(0).isRejected()).toBe(true);
  });

  it('isRejected should return false for score >= 60', () => {
    expect(QualityScore.fromNumber(60).isRejected()).toBe(false);
    expect(QualityScore.fromNumber(100).isRejected()).toBe(false);
  });

  it('toString should return string value', () => {
    expect(QualityScore.fromNumber(85).toString()).toBe('85');
  });

  it('equals should compare values', () => {
    const score1 = QualityScore.fromNumber(85);
    const score2 = QualityScore.fromNumber(85);
    const score3 = QualityScore.fromNumber(75);
    expect(score1.equals(score2)).toBe(true);
    expect(score1.equals(score3)).toBe(false);
  });
});
