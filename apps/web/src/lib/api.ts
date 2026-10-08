export type ApiRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ApiArticle {
  id: string;
  slug: string;
  title: string;
  dek: string;
  summary: string;
  body: string;
  category: string;
  subcategory: string | null;
  riskLevel: ApiRiskLevel;
  qualityScore: number;
  sourceCount: number;
  publishedAt: string | null;
  updatedAt: string;
}

const API_BASE = import.meta.env.PUBLIC_API_BASE_URL ?? '';
const TIMEOUT_MS = 3000;

async function fetchJson<T>(path: string): Promise<T | null> {
  if (!API_BASE) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}${path}`, { signal: controller.signal });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchPublishedArticles(limit = 50): Promise<ApiArticle[]> {
  const body = await fetchJson<{ data: ApiArticle[] }>(`/api/articles?limit=${limit}`);
  return body?.data ?? [];
}
