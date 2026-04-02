import { NextRequest } from "next/server";
import { searchTweets } from "@/lib/x-api";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token && !process.env.X_API_KEY) {
    return Response.json(
      { error: "Sign in with X or configure API credentials" },
      { status: 401 }
    );
  }

  try {
    const q = request.nextUrl.searchParams.get("q");
    const max = parseInt(request.nextUrl.searchParams.get("max") || "20", 10);

    if (!q) {
      return Response.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const data = await searchTweets(q, max, token);
    return Response.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
