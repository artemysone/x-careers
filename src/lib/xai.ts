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
