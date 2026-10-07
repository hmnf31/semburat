export interface ResearchProvider {
  search(
    query: string,
    maxResults: number
  ): Promise<Array<{ url: string; title: string; snippet: string }>>;
  fetchPage(
    url: string
  ): Promise<{ content: string; metadata: { title: string; publishedAt?: Date; author?: string } }>;
}
