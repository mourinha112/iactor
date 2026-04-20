import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";

export default async function SchedulePage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("scheduled_at", { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="text-[12px] uppercase tracking-wider text-muted">
            Agenda
          </div>
          <h1 className="text-4xl font-semibold tracking-tightest mt-2">
            Suas publicações
          </h1>
        </div>
        <Link href="/app/create">
          <Button>Novo →</Button>
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-2">
          {posts.map((p: any) => (
            <div key={p.id} className="glass rounded-xl p-4 flex gap-4">
              <img
                src={p.image_url}
                alt=""
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] line-clamp-2">{p.caption}</div>
                <div className="text-[12px] text-muted mt-2">
                  {new Date(p.scheduled_at).toLocaleString("pt-BR", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  })}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded ${
                    p.status === "published"
                      ? "bg-accent/20 text-accent"
                      : p.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-elevated text-muted"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-muted text-[14px]">Nenhum post agendado.</div>
        </div>
      )}
    </div>
  );
}
