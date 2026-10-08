import { describe, it, expect, vi, beforeEach } from "vitest";
import { NewsletterPublisher } from "../../../src/adapters/publishing/NewsletterPublisher.js";
import { ContentVariant, Platform, ApprovalState } from "@semburat/domain";
import type { ContentVariantId, ArticleId } from "@semburat/shared";

const API_KEY = "test-newsletter-key";
const LIST_ID = "list-123";

function makeVariant(
  overrides: Partial<{
    id: ContentVariantId;
    articleId: ArticleId;
    platform: Platform;
    format: string;
    content: string;
    approvalState: ApprovalState;
  }> = {}
): ContentVariant {
  return new ContentVariant({
    id: "550e8400-e29b-41d4-a716-446655440000",
    articleId: "550e8400-e29b-41d4-a716-446655440001",
    platform: Platform.NEWSLETTER,
    format: "Weekly Digest #42",
    content: "<h1>Test Newsletter</h1><p>Test content</p>",
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function campaignResponse(id: string) {
  return { ok: true, status: 200, json: async () => ({ id }) };
}

describe("NewsletterPublisher", () => {
  let publisher: NewsletterPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new NewsletterPublisher(API_KEY, LIST_ID, mockFetch as typeof fetch);
  });

  it("publishes newsletter campaign and returns externalId and url", async () => {
    mockFetch.mockResolvedValueOnce(campaignResponse("campaign-abc123"));

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe("newsletter:campaign-abc123");
    expect(result.url).toBe("https://newsletter.semburat.com/campaign/campaign-abc123");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.semburat.com/newsletter/campaigns",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + API_KEY,
        },
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.list_id).toBe(LIST_ID);
    expect(body.subject).toBe("Weekly Digest #42");
    expect(body.html_content).toBe("<h1>Test Newsletter</h1><p>Test content</p>");
    expect(body.text_content).toBe("<h1>Test Newsletter</h1><p>Test content</p>");
  });

  it("throws on non-NEWSLETTER platform", async () => {
    const variant = makeVariant({ platform: Platform.WEB });
    await expect(publisher.publish(variant)).rejects.toThrow(
      "NewsletterPublisher can only publish to NEWSLETTER"
    );
  });

  it("throws on Newsletter API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: "Invalid API key", code: 401 } }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      "Newsletter API error: 401 Invalid API key"
    );
  });

  it("delete calls Newsletter API DELETE with the campaign id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await publisher.delete("newsletter:campaign-abc123");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.semburat.com/newsletter/campaigns/campaign-abc123",
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + API_KEY,
        },
      })
    );
  });

  it("handles missing id in response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe("newsletter:mock-campaign-id");
  });
});
