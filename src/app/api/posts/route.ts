import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { caption, image_url, scheduled_at } = body;

  if (!caption || !image_url || !scheduled_at)
    return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const { data: account } = await supabase
    .from("ig_accounts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      ig_account_id: account?.id ?? null,
      caption,
      image_url,
      scheduled_at,
      status: "scheduled"
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}
