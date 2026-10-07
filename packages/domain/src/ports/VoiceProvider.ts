export interface VoiceProvider {
  synthesize(script: string, voice: string): Promise<{ storageKey: string; duration: number }>;
}
