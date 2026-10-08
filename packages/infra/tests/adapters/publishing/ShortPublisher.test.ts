import { describe, it, expect, vi, beforeEach } from "vitest";
import { ShortPublisher } from "../../../src/adapters/publishing/ShortPublisher.js";
import { ContentVariant, Platform, ApprovalState } from "@semburat/domain";
import type { ContentVariantId, ArticleId, AssetId } from "@semburat/shared";

const ACCESS_TOKEN = "test-youtube-token";

function makeVariant(
  overrides: Partial<{
    id: ContentVariantId;
    articleId: ArticleId;
    platform: Platform;
    format: string;
    content: string;
    assetIds: AssetId[];
    approvalState: ApprovalState;
  }> = {}
): ContentVariant {
  return new ContentVariant({
    id: "550e8400-e29b-41d4-a716-446655440000",
    articleId: "550e8400-e29b-41d4-a716-446655440001",
    platform: Platform.SHORT,
    format: "video/mp4",
    content: "Test short content",
    assetIds: ["asset-1"],
    approvalState: ApprovalState.APPROVED,
    ...overrides,
  });
}

function videoResponse(id: string) {
  return { ok: true, status: 200, json: async () => ({ id }) };
}

describe("ShortPublisher", () => {
  let publisher: ShortPublisher;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    publisher = new ShortPublisher(ACCESS_TOKEN, mockFetch as typeof fetch);
  });

  it("publishes to YouTube Shorts and returns externalId and url", async () => {
    mockFetch.mockResolvedValueOnce(videoResponse("dQw4w9WgXcQ"));

    const variant = makeVariant();
    const result = await publisher.publish(variant);

    expect(result.externalId).toBe("short:dQw4w9WgXcQ");
    expect(result.url).toBe("https://www.youtube.com/shorts/dQw4w9WgXcQ");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://www.googleapis.com/youtube/v3/videos?part=snippet,status&access_token=" + ACCESS_TOKEN,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.snippet.title).toBe("Test short content");
    expect(body.snippet.description).toBe("Test short content");
    expect(body.snippet.tags).toContain("shorts");
    expect(body.status.privacyStatus).toBe("public");
  });

  it("throws on non-SHORT platform", async () => {
    const variant = makeVariant({ platform: Platform.WEB });
    await expect(publisher.publish(variant)).rejects.toThrow(
      "ShortPublisher can only publish to SHORT"
    );
  });

  it("throws when no asset provided", async () => {
    const variant = makeVariant({ assetIds: [] });
    await expect(publisher.publish(variant)).rejects.toThrow(
      "Short publishing requires at least one video asset"
    );
  });

  it("throws on YouTube API error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: "Invalid video format", code: 400 } }),
    });

    const variant = makeVariant();
    await expect(publisher.publish(variant)).rejects.toThrow(
      "YouTube Shorts API error: 400 Invalid video format"
    );
  });

  it("delete calls YouTube API DELETE with the video id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await publisher.delete("short:dQw4w9WgXcQ");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://www.googleapis.com/youtube/v3/videos?id=dQw4w9WgXcQ&access_token=" + ACCESS_TOKEN,
      { method: "DELETE" }
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

    expect(result.externalId).toBe("short:mock-short-id");
  });
});
