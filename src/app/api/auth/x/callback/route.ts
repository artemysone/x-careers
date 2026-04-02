import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  consumePKCEVerifier,
  exchangeCodeForTokens,
  fetchUserProfile,
  setSession,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  // Handle user-denied or X errors
  if (error) {
    return Response.redirect(`${baseUrl}?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return Response.redirect(`${baseUrl}?auth_error=missing_params`);
  }

  // Verify state
  const cookieStore = await cookies();
  const savedState = cookieStore.get("xcareers_oauth_state")?.value;
  cookieStore.delete("xcareers_oauth_state");

  if (state !== savedState) {
    return Response.redirect(`${baseUrl}?auth_error=state_mismatch`);
  }

  // Get PKCE verifier
  const verifier = await consumePKCEVerifier();
  if (!verifier) {
    return Response.redirect(`${baseUrl}?auth_error=missing_verifier`);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, verifier);

    // Fetch user profile
    const user = await fetchUserProfile(tokens.access_token);

    // Store session
    await setSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        profileImageUrl: user.profile_image_url,
      },
    });

    return Response.redirect(baseUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("OAuth callback error:", message);
    return Response.redirect(`${baseUrl}?auth_error=${encodeURIComponent("token_exchange_failed")}`);
  }
}
