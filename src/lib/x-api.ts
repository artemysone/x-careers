import { TwitterApi } from "twitter-api-v2";

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
