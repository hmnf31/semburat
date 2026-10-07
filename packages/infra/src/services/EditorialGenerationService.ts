import type { AIProvider } from '@semburat/domain';

export interface ArticleGenerationInput {
  researchSummary: string;
  facts: Array<{ statement: string; confidence: number }>;
  category: string;
}

export interface GeneratedArticle {
  title: string;
  dek: string;
  body: string;
  summary: string;
  key_points: string[];
  faq: Array<{ question: string; answer: string }>;
  seo_title: string;
  meta_description: string;
}

export class EditorialGenerationService {
  constructor(private readonly aiProvider: AIProvider) {}

  async generateArticle(
    researchSummary: string,
    facts: Array<{ statement: string; confidence: number }>,
    category: string
  ): Promise<GeneratedArticle> {
    const prompt = this.buildPrompt(researchSummary, facts, category);
    const schema = this.getSchema();

    const result = (await this.aiProvider.generateStructured(prompt, schema)) as GeneratedArticle;

    return this.validateAndSanitize(result);
  }

  private buildPrompt(
    researchSummary: string,
    facts: Array<{ statement: string; confidence: number }>,
    category: string
  ): string {
    const factsText = facts
      .map((f, i) => `[${i + 1}] ${f.statement} (confidence: ${f.confidence.toFixed(2)})`)
      .join('\n');

    return [
      'Anda adalah asisten editorial untuk platform kecerdasan media Indonesia SEMBURAT.',
      'Tugas Anda: menghasilkan artikel editorial Indonesia yang faktual, seimbang, dan bermakna dari riset yang diberikan.',
      '',
      'KATEGORI:',
      category,
      '',
      'RINGKASAN RISSET:',
      researchSummary,
      '',
      'FAKTA TERVERIFIKASI:',
      factsText,
      '',
      'INSTRUKSI:',
      '1. Tulis dalam Bahasa Indonesia yang baik, jelas, dan profesional (EYD).',
      '2. Gunakan HANYA fakta yang disediakan. JANGAN menambahkan klaim, kutipan, statistik, atau sumber yang tidak ada dalam fakta.',
      '3. Jika bukti tidak cukup untuk menarik kesimpulan, nyatakan ketidakpastian tersebut secara eksplisit.',
      '4. Hindari sensasionalisme, opini tersembunyi, atau bahasa yang memihak.',
      '5. Struktur artikel: judul, dek (lead paragraph), body (beberapa paragraf dengan sub-topik), ringkasan, poin-poin kunci, FAQ (3-5 item), SEO title, meta description.',
      '6. SEO title: maksimal 60 karakter, mengandung kata kunci utama.',
      '7. Meta description: 150-160 karakter, ringkas dan mengundang klik.',
      '8. FAQ harus menjawab pertanyaan alami pembaca berdasarkan fakta yang ada.',
      '9. Output HANYA JSON yang valid sesuai skema yang diberikan.',
    ].join('\n');
  }

  private getSchema(): object {
    return {
      type: 'object',
      properties: {
        title: { type: 'string', minLength: 10, maxLength: 120 },
        dek: { type: 'string', minLength: 50, maxLength: 300 },
        body: { type: 'string', minLength: 200 },
        summary: { type: 'string', minLength: 50, maxLength: 500 },
        key_points: {
          type: 'array',
          items: { type: 'string' },
          minItems: 3,
          maxItems: 7,
        },
        faq: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string', minLength: 10 },
              answer: { type: 'string', minLength: 20 },
            },
            required: ['question', 'answer'],
          },
          minItems: 3,
          maxItems: 5,
        },
        seo_title: { type: 'string', minLength: 20, maxLength: 60 },
        meta_description: { type: 'string', minLength: 120, maxLength: 160 },
      },
      required: [
        'title',
        'dek',
        'body',
        'summary',
        'key_points',
        'faq',
        'seo_title',
        'meta_description',
      ],
      additionalProperties: false,
    };
  }

  private validateAndSanitize(result: GeneratedArticle): GeneratedArticle {
    if (!result.title || !result.dek || !result.body || !result.summary) {
      throw new Error('AI output missing required fields');
    }

    if (!Array.isArray(result.key_points) || result.key_points.length === 0) {
      throw new Error('AI output missing key_points');
    }

    if (!Array.isArray(result.faq) || result.faq.length === 0) {
      throw new Error('AI output missing faq');
    }

    for (const item of result.faq) {
      if (!item.question || !item.answer) {
        throw new Error('AI output faq item missing question or answer');
      }
    }

    if (!result.seo_title || !result.meta_description) {
      throw new Error('AI output missing SEO fields');
    }

    return {
      title: result.title.trim(),
      dek: result.dek.trim(),
      body: result.body.trim(),
      summary: result.summary.trim(),
      key_points: result.key_points.map((k) => k.trim()).filter(Boolean),
      faq: result.faq.map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      })),
      seo_title: result.seo_title.trim(),
      meta_description: result.meta_description.trim(),
    };
  }
}
