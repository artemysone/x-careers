import { cookies } from "next/headers";
import crypto from "crypto";

// ─── Config ─────────────────────────────────────────────────────────

const COOKIE_NAME = "xcareers_session";
const VERIFIER_COOKIE = "xcareers_pkce";
const ALGORITHM = "aes-256-gcm";

function getSecret(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters. Generate one: openssl rand -base64 32");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

// ─── Encryption ─────────────────────────────────────────────────────

function encrypt(data: string): string {
  const key = getSecret();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag();
  // Format: iv:tag:ciphertext (all base64)
  return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted}`;
}

function decrypt(payload: string): string {
  const key = getSecret();
  const [ivB64, tagB64, ciphertext] = payload.split(":");
  if (!ivB64 || !tagB64 || !ciphertext) throw new Error("Invalid session format");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// ─── Session types ──────────────────────────────────────────────────

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp (ms)
  user: {
    id: string;
    name: string;
    username: string;
    profileImageUrl?: string;
  };
}

// ─── Session management ─────────────────────────────────────────────

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    const session: Session = JSON.parse(decrypt(cookie.value));
    // Check if token is expired (with 60s buffer)
    if (session.expiresAt < Date.now() + 60_000) {
      const refreshed = await refreshAccessToken(session.refreshToken);
      if (refreshed) {
        await setSession(refreshed);
        return refreshed;
      }
      await clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encrypt(JSON.stringify(session)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── PKCE helpers ───────────────────────────────────────────────────

export function generatePKCE(): { verifier: string; challenge: string } {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return { verifier, challenge };
}

export async function storePKCEVerifier(verifier: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(VERIFIER_COOKIE, verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });
}

export async function consumePKCEVerifier(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(VERIFIER_COOKIE);
  if (cookie?.value) {
    cookieStore.delete(VERIFIER_COOKIE);
    return cookie.value;
  }
  return null;
}

// ─── OAuth 2.0 URLs ─────────────────────────────────────────────────

export function getAuthorizationUrl(challenge: string, state: string): string {
  const clientId = process.env.X_CLIENT_ID;
  if (!clientId) throw new Error("X_CLIENT_ID not configured");

  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/x/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "tweet.read tweet.write users.read offline.access",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  return `https://x.com/i/oauth2/authorize?${params.toString()}`;
}

// ─── Token exchange ─────────────────────────────────────────────────

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeCodeForTokens(
  code: string,
  verifier: string
): Promise<TokenResponse> {
  const clientId = process.env.X_CLIENT_ID!;
  const clientSecret = process.env.X_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/auth/x/callback`;

  const res = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }

  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<Session | null> {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetch("https://api.x.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) return null;

    const tokens: TokenResponse = await res.json();

    // Fetch user profile with new token
    const userRes = await fetch("https://api.x.com/2/users/me?user.fields=name,username,profile_image_url", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) return null;
    const userData = await userRes.json();

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      user: {
        id: userData.data.id,
        name: userData.data.name,
        username: userData.data.username,
        profileImageUrl: userData.data.profile_image_url,
      },
    };
  } catch {
    return null;
  }
}

// ─── Fetch user profile ─────────────────────────────────────────────

export async function fetchUserProfile(accessToken: string) {
  const res = await fetch(
    "https://api.x.com/2/users/me?user.fields=name,username,profile_image_url,public_metrics,description,verified",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return (await res.json()).data;
}
