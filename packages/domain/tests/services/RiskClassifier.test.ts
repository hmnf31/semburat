import { describe, it, expect } from 'vitest';
import { RiskClassifier } from '../../src/services/RiskClassifier.js';
import { RiskLevel } from '../../src/value-objects/RiskLevel.js';

describe('RiskClassifier', () => {
  const classifier = new RiskClassifier();

  it('should classify HIGH risk for crime category', () => {
    expect(classifier.classify('crime', 'Some content').value).toBe('HIGH');
  });

  it('should classify HIGH risk for health category', () => {
    expect(classifier.classify('health', 'Some content').value).toBe('HIGH');
  });

  it('should classify HIGH risk for politics category', () => {
    expect(classifier.classify('politics', 'Some content').value).toBe('HIGH');
  });

  it('should classify HIGH risk for finance category', () => {
    expect(classifier.classify('finance', 'Some content').value).toBe('HIGH');
  });

  it('should classify HIGH risk for legal category', () => {
    expect(classifier.classify('legal', 'Some content').value).toBe('HIGH');
  });

  it('should classify HIGH risk for disaster category', () => {
    expect(classifier.classify('disaster', 'Some content').value).toBe('HIGH');
  });

  it('should classify HIGH risk for content with multiple high-risk keywords', () => {
    const content = 'Kematian dan kebakaran menyebabkan korban jiwa dalam kecelakaan lalu lintas';
    expect(classifier.classify('news', content).value).toBe('HIGH');
  });

  it('should classify MEDIUM risk for content with some high-risk keywords', () => {
    const content = 'Pemerintah mengumumkan kebijakan baru tentang kesehatan';
    expect(classifier.classify('news', content).value).toBe('MEDIUM');
  });

  it('should classify LOW risk for normal content', () => {
    const content = 'Tim sepakbola nasional memenangkan pertandingan persahabatan';
    expect(classifier.classify('sports', content).value).toBe('LOW');
  });

  it('should be case insensitive for category', () => {
    expect(classifier.classify('CRIME', 'content').value).toBe('HIGH');
    expect(classifier.classify('Crime', 'content').value).toBe('HIGH');
  });

  it('should be case insensitive for content keywords', () => {
    const content = 'KEMATIAN dan KEBAKARAN di gedung';
    expect(classifier.classify('news', content).value).toBe('HIGH');
  });
});
