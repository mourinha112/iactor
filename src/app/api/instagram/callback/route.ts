import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  exchangeCodeForToken,
  getIgUserFromPage
} from "@/lib/instagram";

export async function GET(req: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/app/settings?err=nocode", req.url));

  const redirectUri = new URL("/api/instagram/callback", req.url).toString();
  const token = await exchangeCodeForToken(code, redirectUri);
  if (!token.access_token)
    return NextResponse.redirect(new URL("/app/settings?err=token", req.url));

  const ig = await getIgUserFromPage(token.access_token);
  if (!ig.igUserId)
    return NextResponse.redirect(new URL("/app/settings?err=noig", req.url));

  // fetch ig username
  const profile = await fetch(
    `https://graph.facebook.com/v19.0/${ig.igUserId}?fields=username&access_token=${ig.pageAccessToken}`
  ).then((r) => r.json());

  await supabase.from("ig_accounts").insert({
    user_id: user.id,
    ig_user_id: ig.igUserId,
    username: profile.username ?? "instagram",
    access_token: ig.pageAccessToken
  });

  return NextResponse.redirect(new URL("/app/settings?ok=1", req.url));
}
