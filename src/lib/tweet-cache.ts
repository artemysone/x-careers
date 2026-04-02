import { searchHiringTweets } from "./x-api";
import { scoreTweetsForRelevance } from "./xai";

// --- Types ---

export interface FeedTweet {
  id: string;
  text: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  verified: boolean;
  createdAt: string;
  likes: number;
  retweets: number;
  views: number;
  grokScore: number | null;
  engagementScore: number;
}

export interface FeedResult {
  tweets: FeedTweet[];
  lastUpdated: string;
  isLive: boolean;
}

interface CachedTweet {
  tweet: FeedTweet;
  fetchedAt: number;
  grokScore: number | null;
}

// --- Constants (configurable via env) ---
// X API is pay-per-use: $0.005/tweet read + $0.010/user read
// Cost per refresh ≈ (RESULTS_PER_QUERY × 2 queries) × $0.015
// Default: 20 results × 2 queries × $0.015 = $0.60/refresh
// At 30-min TTL, 4h active/day = 8 refreshes = ~$4.80/day = ~$144/month

const STALE_MS = parseInt(process.env.FEED_CACHE_TTL_MS ?? String(30 * 60 * 1000)); // 30 minutes
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
const GROK_SCORE_THRESHOLD = 40;
const FEED_SIZE = 20;

// --- Cache singleton (survives HMR in dev via globalThis) ---

interface CacheState {
  tweets: Map<string, CachedTweet>;
  grokScores: Map<string, number>;
  lastFetchedAt: number;
  isRefreshing: boolean;
  refreshPromise: Promise<void> | null;
}

const g = globalThis as unknown as { __tweetCache?: CacheState };
const cache: CacheState = (g.__tweetCache ??= {
  tweets: new Map(),
  grokScores: new Map(),
  lastFetchedAt: 0,
  isRefreshing: false,
  refreshPromise: null,
});

// --- Engagement scoring ---

function computeEngagementScore(likes: number, retweets: number, views: number): number {
  return likes * 3 + retweets * 5 + views * 0.001;
}

// --- Core functions ---

/**
 * Get the curated feed. Serves cached data immediately and triggers a
 * background refresh if stale. Blocks on first-ever fetch (cold start).
 */
export async function getFeed(bearerToken?: string): Promise<FeedResult> {
  const now = Date.now();
  const isEmpty = cache.tweets.size === 0;
  const isStale = now - cache.lastFetchedAt > STALE_MS;

  // Cold start: block until we have data
  if (isEmpty) {
    if (!cache.isRefreshing) {
      cache.refreshPromise = refreshCache(bearerToken);
    }
    await cache.refreshPromise;
  }
  // Stale: serve cached + fire background refresh
  else if (isStale && !cache.isRefreshing) {
    // Fire and forget — don't await
    cache.refreshPromise = refreshCache(bearerToken);
  }

  return buildFeedResult();
}

/**
 * Fetch new tweets, merge into cache, score with Grok.
 */
async function refreshCache(bearerToken?: string): Promise<void> {
  cache.isRefreshing = true;

  try {
    const { tweets, users } = await searchHiringTweets(bearerToken);

    // Build user lookup
    const usersMap = new Map<string, { name: string; username: string; profile_image_url?: string; verified?: boolean }>();
    for (const u of users) {
      usersMap.set(u.id, u);
    }

    const now = Date.now();
    const newTweetIds: { id: string; text: string }[] = [];

    // Merge into cache
    for (const t of tweets) {
      if (cache.tweets.has(t.id)) continue; // already cached

      const user = usersMap.get(t.author_id ?? "");
      const likes = t.public_metrics?.like_count ?? 0;
      const retweets = t.public_metrics?.retweet_count ?? 0;
      const views = t.public_metrics?.impression_count ?? 0;

      const feedTweet: FeedTweet = {
        id: t.id,
        text: t.text,
        authorName: user?.name ?? "Unknown",
        authorUsername: user?.username ?? "unknown",
        authorAvatar: user?.profile_image_url ?? "",
        verified: user?.verified ?? false,
        createdAt: t.created_at ?? new Date().toISOString(),
        likes,
        retweets,
        views,
        grokScore: cache.grokScores.get(t.id) ?? null,
        engagementScore: computeEngagementScore(likes, retweets, views),
      };

      cache.tweets.set(t.id, {
        tweet: feedTweet,
        fetchedAt: now,
        grokScore: cache.grokScores.get(t.id) ?? null,
      });

      // Track unscored tweets for Grok
      if (!cache.grokScores.has(t.id)) {
        newTweetIds.push({ id: t.id, text: t.text });
      }
    }

    // Prune tweets older than 24h
    for (const [id, entry] of cache.tweets) {
      if (now - entry.fetchedAt > MAX_AGE_MS) {
        cache.tweets.delete(id);
        cache.grokScores.delete(id);
      }
    }

    cache.lastFetchedAt = now;

    // Score new tweets with Grok (non-blocking for the cache update)
    if (newTweetIds.length > 0) {
      scoreNewTweets(newTweetIds);
    }
  } catch (err) {
    console.error("[tweet-cache] refresh failed:", err);
  } finally {
    cache.isRefreshing = false;
  }
}

/**
 * Score tweets with Grok and update cache. Runs after refresh completes.
 */
async function scoreNewTweets(tweets: { id: string; text: string }[]) {
  try {
    const scores = await scoreTweetsForRelevance(tweets);

    for (const [id, score] of Object.entries(scores)) {
      cache.grokScores.set(id, score);
      const entry = cache.tweets.get(id);
      if (entry) {
        entry.grokScore = score;
        entry.tweet.grokScore = score;
      }
    }
  } catch (err) {
    console.error("[tweet-cache] Grok scoring failed:", err);
  }
}

/**
 * Build the feed result from current cache state.
 */
function buildFeedResult(): FeedResult {
  const all = Array.from(cache.tweets.values());

  // Filter: remove low-scoring tweets (keep unscored ones)
  const filtered = all.filter(
    (entry) => entry.grokScore === null || entry.grokScore >= GROK_SCORE_THRESHOLD
  );

  // Normalize engagement scores for ranking
  const maxEngagement = Math.max(1, ...filtered.map((e) => e.tweet.engagementScore));

  // Sort by composite score: grok relevance + engagement
  const sorted = filtered.sort((a, b) => {
    const aGrok = a.grokScore ?? 50; // assume mid-range for unscored
    const bGrok = b.grokScore ?? 50;
    const aEngagement = (a.tweet.engagementScore / maxEngagement) * 100;
    const bEngagement = (b.tweet.engagementScore / maxEngagement) * 100;
    const aComposite = aGrok * 0.3 + aEngagement * 0.7;
    const bComposite = bGrok * 0.3 + bEngagement * 0.7;
    return bComposite - aComposite;
  });

  return {
    tweets: sorted.slice(0, FEED_SIZE).map((e) => e.tweet),
    lastUpdated: cache.lastFetchedAt
      ? new Date(cache.lastFetchedAt).toISOString()
      : new Date().toISOString(),
    isLive: cache.lastFetchedAt > 0,
  };
}
