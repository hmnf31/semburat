import type { SoundEffectProvider } from '@semburat/domain';

export interface SFXCatalogEntry {
  id: string;
  name: string;
  storageKey: string;
  tags: string[];
  category: string;
  duration: number;
}

const CATALOG: SFXCatalogEntry[] = [
  {
    id: 'sfx-whoosh-01',
    name: 'Whoosh Transition',
    storageKey: 'media/sfx/whoosh-01.mp3',
    tags: ['whoosh', 'transition', 'movement'],
    category: 'transition',
    duration: 2,
  },
  {
    id: 'sfx-ding-01',
    name: 'Notification Ding',
    storageKey: 'media/sfx/ding-01.mp3',
    tags: ['ding', 'notification', 'alert'],
    category: 'alert',
    duration: 1,
  },
  {
    id: 'sfx-beat-01',
    name: 'Sub Bass Beat',
    storageKey: 'media/sfx/beat-01.mp3',
    tags: ['beat', 'bass', 'music'],
    category: 'music',
    duration: 4,
  },
  {
    id: 'sfx-applause-01',
    name: 'Crowd Applause',
    storageKey: 'media/sfx/applause-01.mp3',
    tags: ['applause', 'crowd', 'reaction'],
    category: 'reaction',
    duration: 5,
  },
  {
    id: 'sfx-timer-01',
    name: 'Timer Tick',
    storageKey: 'media/sfx/timer-01.mp3',
    tags: ['timer', 'clock', 'tick'],
    category: 'ui',
    duration: 1,
  },
  {
    id: 'sfx-drum-01',
    name: 'Drum Hit',
    storageKey: 'media/sfx/drum-01.mp3',
    tags: ['drum', 'hit', 'impact'],
    category: 'impact',
    duration: 1,
  },
  {
    id: 'sfx-chime-01',
    name: 'Chime Bell',
    storageKey: 'media/sfx/chime-01.mp3',
    tags: ['chime', 'bell', 'intro'],
    category: 'intro',
    duration: 3,
  },
  {
    id: 'sfx-laugh-01',
    name: 'Audience Laugh',
    storageKey: 'media/sfx/laugh-01.mp3',
    tags: ['laugh', 'audience', 'reaction'],
    category: 'reaction',
    duration: 3,
  },
];

export class SFXAdapter implements SoundEffectProvider {
  private readonly catalog: SFXCatalogEntry[] = [...CATALOG];

  async search(query: string): Promise<Array<{ id: string; name: string; storageKey: string }>> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [];
    }

    const tokens = q.split(/\s+/).filter(Boolean);
    const scored = this.catalog
      .map((entry) => {
        const haystack = `${entry.name} ${entry.category} ${entry.tags.join(' ')}`.toLowerCase();
        let score = 0;
        for (const token of tokens) {
          if (haystack.includes(token)) {
            score += 1;
          }
        }
        return { entry, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => ({
        id: s.entry.id,
        name: s.entry.name,
        storageKey: s.entry.storageKey,
      }));

    return scored;
  }
}
