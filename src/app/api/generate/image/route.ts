import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { idea } = await req.json();
  if (!idea) return NextResponse.json({ error: "idea required" }, { status: 400 });

  const result = await getOpenAI().images.generate({
    model: "gpt-image-1",
    prompt: `Foto profissional para Instagram, alta qualidade, composição limpa, iluminação cinematográfica. Tema: ${idea}`,
    size: "1024x1024",
    n: 1
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) return NextResponse.json({ error: "no image" }, { status: 500 });

  // upload para storage
  const buffer = Buffer.from(b64, "base64");
  const path = `${user.id}/${Date.now()}.png`;
  const admin = supabaseAdmin();
  const { error } = await admin.storage
    .from("iactor")
    .upload(path, buffer, { contentType: "image/png", upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = admin.storage.from("iactor").getPublicUrl(path);

  await supabase.from("generations").insert({
    user_id: user.id,
    type: "image",
    prompt: idea,
    output: data.publicUrl
  });

  return NextResponse.json({ url: data.publicUrl });
}
