import type { AIProvider } from '@semburat/domain';

export interface MockAIResponse {
  structured(prompt: string): object | undefined;
  text(prompt: string): string;
}

export interface MockAIConfig {
  responses?: Array<{ match: RegExp; data: object }>;
  fallbackStructured?: object;
  fallbackText?: string;
  streamChunks?: string[];
  respond?: MockAIResponse;
}

const DEFAULT_STREAM_CHUNKS = ['Hello', ' ', 'world', '!'];

export class MockAIProvider implements AIProvider {
  private readonly configured: Array<{ match: RegExp; data: object }> = [];
  private fallbackStructured: object = { output: 'mock-structured' };
  private fallbackText = 'This is mock AI generated text.';
  private streamChunks: string[] = [...DEFAULT_STREAM_CHUNKS];
  private readonly custom?: MockAIResponse;

  constructor(config?: MockAIConfig) {
    if (config?.responses) this.configured.push(...config.responses);
    if (config?.fallbackStructured) this.fallbackStructured = config.fallbackStructured;
    if (config?.fallbackText) this.fallbackText = config.fallbackText;
    if (config?.streamChunks) this.streamChunks = config.streamChunks;
    this.custom = config?.respond;
  }

  setStructuredResponse(match: RegExp, data: object): void {
    this.configured.push({ match, data });
  }

  setFallbackStructured(data: object): void {
    this.fallbackStructured = data;
  }

  setFallbackText(text: string): void {
    this.fallbackText = text;
  }

  setStreamChunks(chunks: string[]): void {
    this.streamChunks = chunks;
  }

  async generateStructured(prompt: string, schema?: object): Promise<object> {
    const p = prompt.toLowerCase();
    if (this.custom) {
      const data = this.custom.structured(prompt);
      if (data !== undefined) return data;
    }
    for (const { match, data } of this.configured) {
      if (match.test(p)) return data;
    }
    return this.defaultStructured(prompt, schema);
  }

  async generateText(prompt: string): Promise<string> {
    void prompt;
    if (this.custom) {
      const text = this.custom.text('');
      if (text !== undefined) return text;
    }
    return this.fallbackText;
  }

  async *streamChat(): AsyncIterable<string> {
    for (const chunk of this.streamChunks) {
      yield chunk;
    }
  }

  private defaultStructured(prompt: string, schema?: object): object {
    const bySchema = this.structuredForSchema(schema);
    if (bySchema) return bySchema;

    const p = prompt.toLowerCase();
    const slice = (prompt || '').slice(0, 80);
    if (p.includes('claim') || p.includes('fakta') || p.includes('extract')) {
      return {
        claims: [
          {
            statement: 'Klaim utama berdasarkan sumber yang tersedia.',
            confidence: 0.9,
            support_type: 'supports',
            sources: [],
          },
        ],
        facts: [{ statement: 'Fakta yang terkait dengan klaim di atas.', confidence: 0.85 }],
      };
    }
    if (p.includes('verify') || p.includes('konflik') || p.includes('conflict')) {
      return { conflicts: [], confidence: 0.9, status: 'verified' };
    }
    if (p.includes('quality') || p.includes('support') || p.includes('qualityscore')) {
      return { score: 85, passed: true, issues: [] };
    }
    if (
      p.includes('editorial') ||
      p.includes('headline') ||
      p.includes('article') ||
      p.includes('dek')
    ) {
      const body =
        'Ini adalah isi berita yang dihasilkan secara otomatis. ' +
        slice +
        ' Berita ini disusun berdasarkan temuan riset dan fakta yang telah terverifikasi oleh tim editorial kami. ' +
        'Kami memastikan setiap klaim dilengkapi dengan bukti sumber yang dapat dilacak kembali.';
      return {
        title: slice || 'Berita Terbaru',
        dek: 'Konteks singkat mengenai perkembangan terkini yang sedang ramai dibicarakan.',
        body,
        summary: 'Ringkasan singkat dari berita ini mencakup poin-poin utama yang relevan.',
        key_points: ['Poin utama pertama', 'Poin utama kedua', 'Poin utama ketiga'],
        faq: [{ question: 'Apa ini?', answer: 'Ini adalah ringkasan otomatis.' }],
        source_notes: [{ source: 'MockSource', note: 'Catatan sumber mock.' }],
        uncertainty_notes: ['Catatan ketidakpastian yang dilaporkan.'],
        seo_title: 'Judul SEO untuk Berita Terbaru yang Informatif',
        meta_description:
          'Deskripsi meta yang cukup panjang untuk memenuhi persyaratan SEO dan memberikan konteks kepada pembaca tentang isi berita ini secara lengkap.',
      };
    }
    return this.fallbackStructured;
  }

  private structuredForSchema(schema?: object): object | undefined {
    if (!schema || typeof schema !== 'object') return undefined;
    const required = (schema as { required?: unknown }).required;
    const req = Array.isArray(required)
      ? required.filter((item): item is string => typeof item === 'string')
      : [];
    const has = (key: string): boolean => req.includes(key);

    if (has('summary') && has('claims')) {
      return {
        summary:
          'Ringkasan riset mock: tren ini dibahas oleh beberapa sumber dan menunjukkan perkembangan yang konsisten untuk menguji alur editorial.',
        claims: [
          {
            statement: 'Klaim uji utama dari sumber riset mock.',
            confidence: 0.9,
            supportType: 'supports',
            sources: ['https://example.com/mock-source'],
          },
        ],
        conflicts: [],
        confidenceScore: 0.85,
      };
    }

    if (has('facts')) {
      return {
        facts: [
          {
            statement: 'Fakta uji yang terkait dengan klaim riset mock.',
            confidence: 0.88,
            evidence: [],
          },
        ],
      };
    }

    if (has('verificationStatus')) {
      return { verificationStatus: 'verified', confidence: 0.9 };
    }

    if (has('seo_title') || (has('title') && has('dek') && has('body'))) {
      return {
        title: 'Uji Alur Konten Generator SEMBURAT',
        dek: 'Alur konten generator SEMBURAT dijalankan dengan penyedia AI mode mock untuk memverifikasi setiap tahap berjalan sesuai rancangan.',
        body: 'Paragraf uji untuk alur konten generator SEMBURAT. Konten ini dihasilkan penyedia AI mode mock dan tidak memanggil model bahasa sungguhan, sehingga aman dipakai untuk uji lokal dan integrasi tanpa kredensial. Setiap tahap, mulai dari riset, ekstraksi fakta, verifikasi, hingga penyusunan editorial, diuji agar menghasilkan artikel yang valid secara struktur.',
        summary: 'Ringkasan uji alur konten generator SEMBURAT menggunakan penyedia AI mode mock.',
        key_points: ['Uji tahap riset', 'Uji ekstraksi fakta', 'Uji penyusunan editorial'],
        faq: [
          {
            question: 'Apa yang diuji oleh alur ini?',
            answer:
              'Seluruh tahap pipeline konten diuji menggunakan penyedia AI mode mock tanpa memanggil model sungguhan.',
          },
          {
            question: 'Mengapa memakai mode mock?',
            answer:
              'Agar pengujian alur dapat berjalan tanpa kredensial API dan tanpa biaya panggilan model.',
          },
          {
            question: 'Apa hasil yang diharapkan?',
            answer:
              'Artikel valid terbentuk dengan status dan skor mutu sesuai keluaran quality gate.',
          },
        ],
        seo_title: 'Uji Alur Konten Generator SEMBURAT',
        meta_description:
          'Uji alur konten generator SEMBURAT dengan penyedia AI mode mock untuk memastikan riset, ekstraksi fakta, verifikasi, dan editorial berjalan sesuai rancangan.',
      };
    }

    return undefined;
  }
}
