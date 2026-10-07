import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  EditorialGenerationService,
  type GeneratedArticle,
} from '../../src/services/EditorialGenerationService.js';
import type { AIProvider } from '@semburat/domain';

describe('EditorialGenerationService', () => {
  let mockAIProvider: AIProvider;
  let service: EditorialGenerationService;

  beforeEach(() => {
    mockAIProvider = {
      generateStructured: vi.fn(),
      generateText: vi.fn(),
      streamChat: vi.fn(),
    } as AIProvider;
    service = new EditorialGenerationService(mockAIProvider);
  });

  it('generateArticle returns structured output with correct shape', async () => {
    const mockResult: GeneratedArticle = {
      title: 'Test Article Title About Indonesian Politics',
      dek: 'This is a test lead paragraph that provides context for the article content.',
      body: 'This is the body of the article which contains multiple paragraphs with detailed information about the topic. It should be long enough to pass validation requirements for the article content generation.',
      summary: 'This is a summary of the test article content.',
      key_points: ['Key point one', 'Key point two', 'Key point three'],
      faq: [
        { question: 'What is the main topic?', answer: 'The main topic is Indonesian politics.' },
        { question: 'When did this happen?', answer: 'This happened recently in 2024.' },
        { question: 'Why does it matter?', answer: 'It matters because it affects many people.' },
      ],
      seo_title: 'Test Article About Indonesian Politics',
      meta_description:
        'Read about the latest Indonesian politics news and analysis in this comprehensive article.',
    };

    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue(mockResult);

    const result = await service.generateArticle(
      'Research summary about Indonesian politics',
      [
        { statement: 'Fact 1 about politics', confidence: 0.9 },
        { statement: 'Fact 2 about economics', confidence: 0.8 },
      ],
      'politics'
    );

    expect(result).toEqual(mockResult);
    expect(mockAIProvider.generateStructured).toHaveBeenCalledTimes(1);
    const callArgs = vi.mocked(mockAIProvider.generateStructured).mock.calls[0];
    expect(callArgs[0]).toContain('Anda adalah asisten editorial');
    expect(callArgs[0]).toContain('politics');
    expect(callArgs[0]).toContain('Fact 1 about politics');
  });

  it('generateArticle throws when AI output missing required fields', async () => {
    const invalidResult = {
      title: 'Short',
      dek: 'Short dek',
      body: 'Short body',
      summary: 'Short summary',
      key_points: [],
      faq: [],
      seo_title: 'Short SEO',
      meta_description: 'Short meta',
    };

    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue(invalidResult);

    await expect(
      service.generateArticle(
        'Research summary',
        [{ statement: 'Fact 1', confidence: 0.9 }],
        'news'
      )
    ).rejects.toThrow('AI output missing key_points');
  });

  it('generateArticle throws when AI output missing key_points', async () => {
    const invalidResult = {
      title: 'Valid Title Here',
      dek: 'Valid dek that is long enough to pass validation requirements',
      body: 'Valid body that is long enough to pass validation requirements for the article content generation',
      summary: 'Valid summary that is long enough',
      key_points: [],
      faq: [{ question: 'Q1?', answer: 'A1' }],
      seo_title: 'Valid SEO Title Here',
      meta_description: 'Valid meta description that is long enough',
    };

    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue(invalidResult);

    await expect(
      service.generateArticle(
        'Research summary',
        [{ statement: 'Fact 1', confidence: 0.9 }],
        'news'
      )
    ).rejects.toThrow('AI output missing key_points');
  });

  it('generateArticle throws when AI output missing faq', async () => {
    const invalidResult = {
      title: 'Valid Title Here',
      dek: 'Valid dek that is long enough to pass validation requirements',
      body: 'Valid body that is long enough to pass validation requirements for the article content generation',
      summary: 'Valid summary that is long enough',
      key_points: ['Point 1', 'Point 2', 'Point 3'],
      faq: [],
      seo_title: 'Valid SEO Title Here',
      meta_description: 'Valid meta description that is long enough',
    };

    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue(invalidResult);

    await expect(
      service.generateArticle(
        'Research summary',
        [{ statement: 'Fact 1', confidence: 0.9 }],
        'news'
      )
    ).rejects.toThrow('AI output missing faq');
  });

  it('generateArticle validates FAQ items have question and answer', async () => {
    const invalidResult = {
      title: 'Valid Title Here',
      dek: 'Valid dek that is long enough to pass validation requirements',
      body: 'Valid body that is long enough to pass validation requirements for the article content generation',
      summary: 'Valid summary that is long enough',
      key_points: ['Point 1', 'Point 2', 'Point 3'],
      faq: [{ question: '', answer: 'Answer' }],
      seo_title: 'Valid SEO Title Here',
      meta_description: 'Valid meta description that is long enough',
    };

    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue(invalidResult);

    await expect(
      service.generateArticle(
        'Research summary',
        [{ statement: 'Fact 1', confidence: 0.9 }],
        'news'
      )
    ).rejects.toThrow('AI output faq item missing question or answer');
  });

  it('generateArticle sanitizes output by trimming strings', async () => {
    const mockResult: GeneratedArticle = {
      title: '  Test Article Title With Whitespace  ',
      dek: '  This is a test lead paragraph with whitespace.  ',
      body: '  This is the body with whitespace.  ',
      summary: '  Summary with whitespace.  ',
      key_points: ['  Point 1  ', '  Point 2  '],
      faq: [
        { question: '  Question 1?  ', answer: '  Answer 1  ' },
        { question: '  Question 2?  ', answer: '  Answer 2  ' },
        { question: '  Question 3?  ', answer: '  Answer 3  ' },
      ],
      seo_title: '  SEO Title With Whitespace  ',
      meta_description: '  Meta description with whitespace.  ',
    };

    vi.mocked(mockAIProvider.generateStructured).mockResolvedValue(mockResult);

    const result = await service.generateArticle(
      'Research summary',
      [{ statement: 'Fact 1', confidence: 0.9 }],
      'news'
    );

    expect(result.title).toBe('Test Article Title With Whitespace');
    expect(result.dek).toBe('This is a test lead paragraph with whitespace.');
    expect(result.body).toBe('This is the body with whitespace.');
    expect(result.summary).toBe('Summary with whitespace.');
    expect(result.key_points).toEqual(['Point 1', 'Point 2']);
    expect(result.faq[0].question).toBe('Question 1?');
    expect(result.faq[0].answer).toBe('Answer 1');
    expect(result.seo_title).toBe('SEO Title With Whitespace');
    expect(result.meta_description).toBe('Meta description with whitespace.');
  });
});
