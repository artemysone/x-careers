import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.XAI_API_KEY!,
      baseURL: "https://api.x.ai/v1",
    });
  }
  return _client;
}

function getModel(): string {
  return process.env.XAI_MODEL || "grok-4-1-fast-reasoning";
}

export type GrokMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * Send a chat completion to Grok and return the assistant's reply.
 */
export async function chat(
  messages: GrokMessage[],
  opts?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const res = await getClient().chat.completions.create({
    model: getModel(),
    messages,
    temperature: opts?.temperature ?? 0.7,
    max_tokens: opts?.maxTokens ?? 1024,
  });
  return res.choices[0]?.message?.content ?? "";
}

/**
 * Generate career insights for a user profile.
 */
export async function careerInsights(profile: {
  skills: string[];
  role: string;
  experience: string;
  location: string;
}): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are Grok, the AI assistant built by xAI. You provide sharp, data-driven career market insights. Be concise and specific. Reference real market trends when possible. Format your response as JSON with this structure:
{
  "insights": [
    { "title": "string", "body": "string", "type": "opportunity|warning|trend" }
  ],
  "marketScore": number (0-1000),
  "summary": "string"
}`,
    },
    {
      role: "user",
      content: `Analyze this professional profile and give career market insights:\n\nRole: ${profile.role}\nSkills: ${profile.skills.join(", ")}\nExperience: ${profile.experience}\nLocation: ${profile.location}`,
    },
  ]);
}

/**
 * Analyze a job posting and return match/salary insights.
 */
export async function analyzeJob(job: {
  title: string;
  company: string;
  skills: string[];
  salary?: string;
  location: string;
}, userSkills: string[]): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are Grok, the AI assistant built by xAI. Analyze job postings against a candidate's skills. Be direct and quantitative. Return JSON:
{
  "matchPercent": number,
  "salaryAnalysis": "string",
  "hiringVelocity": "string",
  "recommendation": "string"
}`,
    },
    {
      role: "user",
      content: `Job: ${job.title} at ${job.company}\nLocation: ${job.location}\nRequired skills: ${job.skills.join(", ")}${job.salary ? `\nSalary: ${job.salary}` : ""}\n\nCandidate skills: ${userSkills.join(", ")}`,
    },
  ]);
}

/**
 * Batch-score tweets for relevance to hiring/talent market signals.
 * Returns a map of tweet ID → score (0-100).
 * On failure, returns an empty object (pipeline degrades to engagement-only sorting).
 */
export async function scoreTweetsForRelevance(
  tweets: { id: string; text: string }[]
): Promise<Record<string, number>> {
  if (tweets.length === 0) return {};

  const tweetList = tweets
    .map((t) => `ID: ${t.id}\nText: ${t.text}`)
    .join("\n\n");

  try {
    const raw = await chat(
      [
        {
          role: "system",
          content: `You are a content relevance scorer for a US-focused tech hiring marketplace. Score each tweet 0-100 for how relevant it is to genuine tech hiring and career opportunities IN THE UNITED STATES.

High scores (80-100): Real US-based job postings with details, hiring announcements from US companies, roles listing US cities/states, salaries in USD, US market signals.
Medium scores (40-79): Posts from known US companies without explicit location, remote roles that could be US-based, general US tech industry trends.
Low scores (0-39): Non-US jobs (Nigeria, India, UK, UAE, etc.), spam, self-promotion, crypto/forex, MLM, generic motivational content, recruitment agency ads without specifics, "DM me for opportunities" posts.

If a post mentions a non-US location (Lagos, Bangalore, London, etc.) or is clearly targeting a non-US market, score it below 30 regardless of quality.

Return ONLY valid JSON: an object mapping tweet ID to score. Example: {"123": 85, "456": 20}`,
        },
        { role: "user", content: tweetList },
      ],
      { temperature: 0, maxTokens: 512 }
    );

    // Strip markdown fences if present
    const cleaned = raw.replace(/```(?:json)?\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned) as Record<string, number>;

    // Clamp scores to 0-100
    const result: Record<string, number> = {};
    for (const [id, score] of Object.entries(parsed)) {
      if (typeof score === "number") {
        result[id] = Math.max(0, Math.min(100, Math.round(score)));
      }
    }
    return result;
  } catch {
    // Grok unavailable or bad response — degrade gracefully
    return {};
  }
}

/**
 * General-purpose Grok chat for the conversational UI.
 */
export async function grokChat(
  userMessage: string,
  conversationHistory: GrokMessage[] = []
): Promise<string> {
  return chat([
    {
      role: "system",
      content:
        "You are Grok, the AI assistant built by xAI, embedded in X Careers — a talent marketplace platform. Help users with career questions, job market analysis, salary negotiations, and professional growth. Be witty, direct, and data-informed.",
    },
    ...conversationHistory,
    { role: "user", content: userMessage },
  ]);
}
