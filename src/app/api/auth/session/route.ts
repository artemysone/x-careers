import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ authenticated: false });
  }

  // Return user info but never expose tokens to the client
  return Response.json({
    authenticated: true,
    user: session.user,
  });
}
