import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { publishToInstagram } from "@/lib/instagram";

// Vercel cron — runs every minute
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = supabaseAdmin();
  const now = new Date().toISOString();
  const { data: due } = await admin
    .from("posts")
    .select("*, ig_accounts(*)")
    .eq("status", "scheduled")
    .lte("scheduled_at", now)
    .limit(10);

  const results: any[] = [];
  for (const post of due ?? []) {
    await admin.from("posts").update({ status: "publishing" }).eq("id", post.id);
    try {
      const account = post.ig_accounts;
      if (!account) throw new Error("no ig account connected");
      const mediaId = await publishToInstagram({
        igUserId: account.ig_user_id,
        accessToken: account.access_token,
        imageUrl: post.image_url,
        caption: post.caption
      });
      await admin
        .from("posts")
        .update({
          status: "published",
          ig_media_id: mediaId,
          published_at: new Date().toISOString()
        })
        .eq("id", post.id);
      results.push({ id: post.id, ok: true });
    } catch (e: any) {
      await admin
        .from("posts")
        .update({ status: "failed", error: String(e?.message ?? e) })
        .eq("id", post.id);
      results.push({ id: post.id, ok: false, error: String(e?.message ?? e) });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
