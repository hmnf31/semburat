export interface ResearchResult {
  url: string;
  title: string;
  snippet: string;
  publishedAt?: Date;
}

export interface ResearchProvider {
  search(query: string, maxResults: number): Promise<ResearchResult[]>;
  fetchPage(
    url: string
  ): Promise<{ content: string; metadata: { title: string; publishedAt?: Date; author?: string } }>;
}
