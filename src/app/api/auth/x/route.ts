import crypto from "crypto";
import { cookies } from "next/headers";
import { generatePKCE, storePKCEVerifier, getAuthorizationUrl } from "@/lib/auth";

export async function GET() {
  if (!process.env.X_CLIENT_ID) {
    return Response.json(
      { error: "X_CLIENT_ID not configured" },
      { status: 503 }
    );
  }

  const { verifier, challenge } = generatePKCE();
  const state = crypto.randomBytes(16).toString("base64url");

  // Store verifier and state in cookies
  await storePKCEVerifier(verifier);
  const cookieStore = await cookies();
  cookieStore.set("xcareers_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  const url = getAuthorizationUrl(challenge, state);
  return Response.redirect(url);
}
