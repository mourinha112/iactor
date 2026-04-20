import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { idea, tone } = await req.json();
  if (!idea) return NextResponse.json({ error: "idea required" }, { status: 400 });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é um copywriter especialista em Instagram brasileiro. Escreva legendas com gancho forte na primeira linha, corpo envolvente e CTA. Use quebras de linha. Inclua 5 hashtags relevantes ao final. Tom: " +
          (tone ?? "casual")
      },
      { role: "user", content: idea }
    ]
  });

  const caption = completion.choices[0]?.message?.content ?? "";

  await supabase.from("generations").insert({
    user_id: user.id,
    type: "caption",
    prompt: idea,
    output: caption
  });

  return NextResponse.json({ caption });
}
