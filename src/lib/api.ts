/**
 * Client-side API helpers for calling our Next.js route handlers.
 * All secrets stay server-side — these functions just fetch.
 */

// ─── Grok / xAI ────────────────────────────────────────────────────

export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function grokChat(
  message: string,
  history: GrokMessage[] = []
): Promise<string> {
  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "chat", message, history }),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  const data = await res.json();
  return data.reply;
}

export async function grokInsights(profile: {
  skills: string[];
  role: string;
  experience: string;
  location: string;
}) {
  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "insights", profile }),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  return (await res.json()).data;
}

export async function grokAnalyzeJob(
  job: { title: string; company: string; skills: string[]; salary?: string; location: string },
  userSkills: string[]
) {
  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "analyze-job", job, userSkills }),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  return (await res.json()).data;
}

// ─── X API ──────────────────────────────────────────────────────────

export async function postTweet(text: string, replyTo?: string) {
  const res = await fetch("/api/x/tweet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, replyTo }),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  return (await res.json()).data;
}

export async function searchTweets(query: string, max: number = 20) {
  const params = new URLSearchParams({ q: query, max: String(max) });
  const res = await fetch(`/api/x/search?${params}`);
  if (!res.ok) throw new Error(await errorMessage(res));
  return (await res.json()).data;
}

export async function getMyProfile() {
  const res = await fetch("/api/x/me");
  if (!res.ok) throw new Error(await errorMessage(res));
  return (await res.json()).data;
}

// ─── Helpers ────────────────────────────────────────────────────────

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.error || `API error: ${res.status}`;
  } catch {
    return `API error: ${res.status}`;
  }
}

/**
 * Check if an API is configured (returns true) or missing credentials (503).
 * Useful for deciding whether to show live vs. mock data.
 */
export async function isApiConfigured(path: "/api/grok" | "/api/x/me"): Promise<boolean> {
  try {
    const res = await fetch(path, {
      method: path === "/api/grok" ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      ...(path === "/api/grok" ? { body: JSON.stringify({ action: "raw", messages: [] }) } : {}),
    });
    return res.status !== 503;
  } catch {
    return false;
  }
}
