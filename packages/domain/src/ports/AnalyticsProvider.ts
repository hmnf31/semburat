export interface AnalyticsProvider {
  trackEvent(event: { type: string; contentId: string; properties: object }): Promise<void>;
}
