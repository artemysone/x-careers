import { TwitterApi, type Tweetv2SearchParams } from "twitter-api-v2";

/**
 * Get a Twitter API client. Supports two modes:
 * 1. OAuth 2.0 Bearer token (from user session) — preferred
 * 2. OAuth 1.0a app tokens (from env vars) — fallback for dev
 */
function getClient(bearerToken?: string) {
  // OAuth 2.0 user session token
  if (bearerToken) {
    return new TwitterApi(bearerToken);
  }

  // Fallback: OAuth 1.0a from env vars (full read + write)
  const appKey = process.env.X_API_KEY;
  const appSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET;

  if (appKey && appSecret && accessToken && accessSecret) {
    return new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });
  }

  // Fallback: App-only bearer token (read-only)
  const appBearer = process.env.X_BEARER_TOKEN;
  if (appBearer) {
    return new TwitterApi(appBearer);
  }

  throw new Error(
    "No X credentials available. Sign in with X or set API keys in .env.local"
  );
}

/**
 * Post a tweet. Returns the created tweet data.
 */
export async function postTweet(text: string, bearerToken?: string) {
  const client = getClient(bearerToken);
  const result = await client.v2.tweet(text);
  return result.data;
}

/**
 * Post a tweet as a reply to another tweet.
 */
export async function replyToTweet(text: string, inReplyToId: string, bearerToken?: string) {
  const client = getClient(bearerToken);
  const result = await client.v2.reply(text, inReplyToId);
  return result.data;
}

/**
 * Search recent tweets. Returns up to `max` results.
 */
export async function searchTweets(query: string, max: number = 20, bearerToken?: string) {
  const client = getClient(bearerToken);
  const result = await client.v2.search(query, {
    max_results: Math.min(max, 100) as 10 | 20 | 50 | 100,
    "tweet.fields": [
      "created_at",
      "public_metrics",
      "author_id",
      "entities",
    ],
    "user.fields": ["name", "username", "profile_image_url", "verified"],
    expansions: ["author_id"],
  });
  return {
    tweets: result.data?.data ?? [],
    users: result.data?.includes?.users ?? [],
  };
}

/**
 * Search for hiring-related tweets using targeted queries with spam filters.
 * Runs 2 queries in parallel and deduplicates results.
 */
export async function searchHiringTweets(bearerToken?: string) {
  const client = getClient(bearerToken);

  const queries = [
    `("we're hiring" OR "we are hiring" OR "join our team" OR "now hiring") is:verified -is:retweet -is:reply lang:en`,
    `("hiring" OR "open role") ("engineer" OR "developer" OR "designer" OR "product manager") is:verified -is:retweet -is:reply lang:en`,
  ];

  // X API pay-per-use: $0.005/tweet + $0.010/user per result
  // Default 20 per query (40 total) — Grok filters ~80%, so we need volume
  const perQuery = parseInt(process.env.FEED_RESULTS_PER_QUERY ?? "20") as 10 | 20 | 50 | 100;
  const searchOpts: Partial<Tweetv2SearchParams> = {
    max_results: perQuery,
    sort_order: "relevancy",
    "tweet.fields": ["created_at", "public_metrics", "author_id", "entities"],
    "user.fields": ["name", "username", "profile_image_url", "verified", "location"],
    expansions: ["author_id"],
  };

  const results = await Promise.all(
    queries.map(async (query) => {
      try {
        return await client.v2.search(query, searchOpts);
      } catch {
        // sort_order may not be available on all tiers — retry without it
        const { sort_order: _, ...fallbackOpts } = searchOpts;
        return await client.v2.search(query, fallbackOpts);
      }
    })
  );

  // Merge and deduplicate tweets + users
  const tweetsMap = new Map<string, { id: string; text: string; created_at?: string; author_id?: string; public_metrics?: { like_count: number; retweet_count: number; impression_count: number } }>();
  const usersMap = new Map<string, { id: string; name: string; username: string; profile_image_url?: string; verified?: boolean; location?: string }>();

  for (const result of results) {
    for (const tweet of result.data?.data ?? []) {
      tweetsMap.set(tweet.id, tweet as typeof tweetsMap extends Map<string, infer V> ? V : never);
    }
    for (const user of result.data?.includes?.users ?? []) {
      usersMap.set(user.id, user as typeof usersMap extends Map<string, infer V> ? V : never);
    }
  }

  return {
    tweets: Array.from(tweetsMap.values()),
    users: Array.from(usersMap.values()),
  };
}

/**
 * Get the authenticated user's recent tweets.
 */
export async function getMyTweets(max: number = 20, bearerToken?: string) {
  const client = getClient(bearerToken);
  const me = await client.v2.me();
  const timeline = await client.v2.userTimeline(me.data.id, {
    max_results: Math.min(max, 100) as 10 | 20 | 50 | 100,
    "tweet.fields": ["created_at", "public_metrics", "entities"],
  });
  return {
    user: me.data,
    tweets: timeline.data?.data ?? [],
  };
}

/**
 * Get a single tweet by ID with full metrics.
 */
export async function getTweet(id: string, bearerToken?: string) {
  const client = getClient(bearerToken);
  const result = await client.v2.singleTweet(id, {
    "tweet.fields": [
      "created_at",
      "public_metrics",
      "author_id",
      "entities",
      "context_annotations",
    ],
    "user.fields": ["name", "username", "profile_image_url", "verified"],
    expansions: ["author_id"],
  });
  return result.data;
}

/**
 * Get the authenticated user's profile.
 */
export async function getMe(bearerToken?: string) {
  const client = getClient(bearerToken);
  const me = await client.v2.me({
    "user.fields": [
      "name",
      "username",
      "profile_image_url",
      "public_metrics",
      "description",
      "verified",
    ],
  });
  return me.data;
}
