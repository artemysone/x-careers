import { NextRequest } from "next/server";
import { postTweet, replyToTweet } from "@/lib/x-api";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token && !process.env.X_API_KEY) {
    return Response.json(
      { error: "Sign in with X or configure API credentials" },
      { status: 401 }
    );
  }

  try {
    const { text, replyTo } = (await request.json()) as {
      text: string;
      replyTo?: string;
    };

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "Tweet text is required" }, { status: 400 });
    }

    if (text.length > 280) {
      return Response.json(
        { error: `Tweet exceeds 280 characters (${text.length})` },
        { status: 400 }
      );
    }

    const data = replyTo
      ? await replyToTweet(text, replyTo, token)
      : await postTweet(text, token);

    return Response.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
