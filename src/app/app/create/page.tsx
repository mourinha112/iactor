"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Label } from "@/components/ui";

type Step = "idea" | "preview" | "schedule";

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("idea");
  const [idea, setIdea] = useState("");
  const [tone, setTone] = useState("casual");
  const [loading, setLoading] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");

  async function generate() {
    if (!idea.trim()) return;
    setLoading("Gerando ideias e visual…");
    try {
      const [textRes, imgRes] = await Promise.all([
        fetch("/api/generate/text", {
          method: "POST",
          body: JSON.stringify({ idea, tone })
        }).then((r) => r.json()),
        fetch("/api/generate/image", {
          method: "POST",
          body: JSON.stringify({ idea })
        }).then((r) => r.json())
      ]);
      setCaption(textRes.caption ?? "");
      setImageUrl(imgRes.url ?? "");
      setStep("preview");
    } catch (e) {
      alert("Falha ao gerar. Verifique a chave OpenAI.");
    } finally {
      setLoading(null);
    }
  }

  async function regenerateText() {
    setLoading("Reescrevendo…");
    const r = await fetch("/api/generate/text", {
      method: "POST",
      body: JSON.stringify({ idea, tone })
    }).then((r) => r.json());
    setCaption(r.caption ?? "");
    setLoading(null);
  }

  async function regenerateImage() {
    setLoading("Gerando outra imagem…");
    const r = await fetch("/api/generate/image", {
      method: "POST",
      body: JSON.stringify({ idea })
    }).then((r) => r.json());
    setImageUrl(r.url ?? "");
    setLoading(null);
  }

  async function schedule() {
    if (!scheduleAt) return alert("Escolha uma data");
    setLoading("Agendando…");
    const r = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        caption,
        image_url: imageUrl,
        scheduled_at: new Date(scheduleAt).toISOString()
      })
    });
    setLoading(null);
    if (!r.ok) return alert("Falha ao agendar");
    router.push("/app/schedule");
    router.refresh();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <div className="text-[12px] uppercase tracking-wider text-muted">
          Novo post
        </div>
        <h1 className="text-4xl font-semibold tracking-tightest mt-2">
          {step === "idea" && "O que vamos publicar hoje?"}
          {step === "preview" && "Aprovado?"}
          {step === "schedule" && "Quando publicar?"}
        </h1>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {(["idea", "preview", "schedule"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition ${
              ["idea", "preview", "schedule"].indexOf(step) >= i
                ? "bg-accent"
                : "bg-elevated"
            }`}
          />
        ))}
      </div>

      {step === "idea" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Sua ideia</Label>
            <Textarea
              rows={5}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ex: post sobre os benefícios de acordar cedo, com tom inspirador para empreendedores"
            />
          </div>
          <div className="space-y-2">
            <Label>Tom</Label>
            <div className="flex gap-2 flex-wrap">
              {["casual", "inspirador", "profissional", "engraçado", "ousado"].map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 h-9 rounded-xl text-[13px] transition ${
                      tone === t
                        ? "bg-accent text-bg"
                        : "bg-elevated text-muted hover:text-text hairline"
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={generate} disabled={!!loading || !idea.trim()}>
              {loading ?? "Gerar tudo →"}
            </Button>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>Imagem</Label>
            <div className="aspect-square rounded-2xl overflow-hidden hairline bg-elevated">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full shimmer" />
              )}
            </div>
            <button
              onClick={regenerateImage}
              className="text-[12px] text-muted hover:text-text"
            >
              ↻ Gerar outra
            </button>
          </div>
          <div className="space-y-3">
            <Label>Legenda</Label>
            <Textarea
              rows={12}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              onClick={regenerateText}
              className="text-[12px] text-muted hover:text-text"
            >
              ↻ Reescrever
            </button>
          </div>
          <div className="md:col-span-2 flex justify-between pt-4">
            <button
              onClick={() => setStep("idea")}
              className="text-[13px] text-muted hover:text-text"
            >
              ← voltar
            </button>
            <Button onClick={() => setStep("schedule")}>Continuar →</Button>
          </div>
        </div>
      )}

      {step === "schedule" && (
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label>Data e hora</Label>
            <Input
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
            />
          </div>
          <div className="text-[12px] text-muted">
            Vamos publicar automaticamente no seu Instagram conectado.
          </div>
          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep("preview")}
              className="text-[13px] text-muted hover:text-text"
            >
              ← voltar
            </button>
            <Button onClick={schedule} disabled={!!loading}>
              {loading ?? "Agendar publicação"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
