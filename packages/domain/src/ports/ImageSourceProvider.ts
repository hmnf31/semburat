import type { LicenseState } from '../entities/Source.js';

export interface ImageCandidate {
  /** Adapter that produced the candidate (openverse, wikimedia, deviantart, ...). */
  provider: string;
  /** Direct image URL that can be downloaded. */
  url: string;
  title: string;
  /** Human landing page for provenance. */
  sourceUrl?: string;
  creator?: string;
  /** Raw license identifier from the source (e.g. 'cc0', 'by-sa', 'pdm'). */
  licenseCode?: string;
  licenseState: LicenseState;
  /** Credit string to render when the asset is reused. */
  creditText?: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  tags?: string[];
}

export interface ImageSourceProvider {
  readonly name: string;
  search(query: string, maxResults: number): Promise<ImageCandidate[]>;
}
