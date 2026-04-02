import { getMe, getMyTweets } from "@/lib/x-api";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token && !process.env.X_API_KEY) {
    return Response.json(
      { error: "Sign in with X or configure API credentials" },
      { status: 401 }
    );
  }

  try {
    const [profile, timeline] = await Promise.all([
      getMe(token),
      getMyTweets(20, token),
    ]);

    return Response.json({
      data: {
        profile,
        tweets: timeline.tweets,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
