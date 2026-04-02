import { NextRequest } from "next/server";
import { chat, careerInsights, analyzeJob, grokChat, type GrokMessage } from "@/lib/xai";

export async function POST(request: NextRequest) {
  if (!process.env.XAI_API_KEY) {
    return Response.json(
      { error: "XAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case "chat": {
        const { message, history } = body as {
          message: string;
          history?: GrokMessage[];
        };
        const reply = await grokChat(message, history);
        return Response.json({ reply });
      }

      case "insights": {
        const { profile } = body as {
          profile: { skills: string[]; role: string; experience: string; location: string };
        };
        const raw = await careerInsights(profile);
        try {
          return Response.json({ data: JSON.parse(raw) });
        } catch {
          return Response.json({ data: raw });
        }
      }

      case "analyze-job": {
        const { job, userSkills } = body as {
          job: { title: string; company: string; skills: string[]; salary?: string; location: string };
          userSkills: string[];
        };
        const raw = await analyzeJob(job, userSkills);
        try {
          return Response.json({ data: JSON.parse(raw) });
        } catch {
          return Response.json({ data: raw });
        }
      }

      case "raw": {
        const { messages, temperature, maxTokens } = body as {
          messages: GrokMessage[];
          temperature?: number;
          maxTokens?: number;
        };
        const reply = await chat(messages, { temperature, maxTokens });
        return Response.json({ reply });
      }

      default:
        return Response.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
