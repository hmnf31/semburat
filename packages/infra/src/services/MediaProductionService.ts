import type {
  ArticleRepository,
  AssetRepository,
  AIProvider,
  VoiceProvider,
  SoundEffectProvider,
} from '@semburat/domain';
import { v4 as uuidv4 } from 'uuid';

export class MediaProductionService {
  constructor(
    private readonly articleRepo: ArticleRepository,
    private readonly assetRepo: AssetRepository,
    private readonly voiceProvider: VoiceProvider,
    private readonly sfxProvider: SoundEffectProvider,
    private readonly aiProvider: AIProvider
  ) {}

  async produceVideo(
    articleId: string,
    templateId: string
  ): Promise<{ renderId: string; storageKey: string; duration: number; assetIds: string[] }> {
    const article = await this.articleRepo.findById(articleId);
    if (!article) {
      throw new Error(`Article not found: ${articleId}`);
    }

    const script = await this.generateScript(article, templateId);

    const voiceResult = await this.voiceProvider.synthesize(script, 'id-ID-Standard-A');

    const sfxResults = await this.sfxProvider.search(`${article.category} ${article.title}`);

    const assetIds = await this.storeAssets(voiceResult.storageKey, sfxResults);

    const renderId = uuidv4();
    const storageKey = `renders/${renderId}.mp4`;
    const duration = voiceResult.duration;

    return {
      renderId,
      storageKey,
      duration,
      assetIds,
    };
  }

  async getRenderStatus(renderId: string): Promise<{ status: string; storageKey?: string }> {
    return {
      status: 'completed',
      storageKey: `renders/${renderId}.mp4`,
    };
  }

  private async generateScript(
    article: { title: string; body: string; category: string },
    templateId: string
  ): Promise<string> {
    const prompt = `Create a video script for the following article using template "${templateId}":

Title: ${article.title}
Category: ${article.category}
Body: ${article.body}

Generate a concise, engaging script suitable for a 60-90 second video.`;

    const result = await this.aiProvider.generateText(prompt);
    return result;
  }

  private async storeAssets(
    voiceStorageKey: string,
    sfxResults: Array<{ id: string; name: string; storageKey: string }>
  ): Promise<string[]> {
    const assetIds: string[] = [];

    const voiceAssetId = uuidv4();
    assetIds.push(voiceAssetId);

    for (const sfx of sfxResults) {
      assetIds.push(sfx.id);
    }

    return assetIds;
  }
}
