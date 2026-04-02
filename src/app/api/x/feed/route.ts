import { getFeed } from "@/lib/tweet-cache";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token && !process.env.X_API_KEY && !process.env.X_BEARER_TOKEN) {
    return Response.json(
      { error: "Sign in with X or configure API credentials" },
      { status: 401 }
    );
  }

  try {
    const feed = await getFeed(token);
    return Response.json({ data: feed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
