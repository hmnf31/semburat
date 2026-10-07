export interface ImageProvider {
  generateImage(prompt: string, size: string): Promise<{ url: string; storageKey: string }>;
  transformImage(sourceKey: string, transforms: Array<string>): Promise<string>;
}
