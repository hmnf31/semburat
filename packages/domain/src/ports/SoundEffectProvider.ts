export interface SoundEffectProvider {
  search(query: string): Promise<Array<{ id: string; name: string; storageKey: string }>>;
}
