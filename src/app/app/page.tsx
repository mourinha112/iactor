import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("scheduled_at", { ascending: true })
    .limit(5);

  const scheduled = posts?.filter((p) => p.status === "scheduled").length ?? 0;
  const published = posts?.filter((p) => p.status === "published").length ?? 0;

  return (
    <div>
      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="text-[12px] uppercase tracking-wider text-muted">
            Visão geral
          </div>
          <h1 className="text-4xl font-semibold tracking-tightest mt-2">
            Bom te ver de volta.
          </h1>
        </div>
        <Link href="/app/create">
          <Button>Novo post →</Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-12">
        <Stat label="Agendados" value={scheduled} />
        <Stat label="Publicados" value={published} />
        <Stat label="Rascunhos" value={0} />
      </div>

      <div>
        <div className="text-[12px] uppercase tracking-wider text-muted mb-4">
          Próximas publicações
        </div>
        {posts && posts.length > 0 ? (
          <div className="space-y-2">
            {posts.map((p: any) => (
              <div
                key={p.id}
                className="glass rounded-xl p-4 flex items-center gap-4"
              >
                <img
                  src={p.image_url}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] truncate">{p.caption}</div>
                  <div className="text-[12px] text-muted mt-1">
                    {new Date(p.scheduled_at).toLocaleString("pt-BR")}
                  </div>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-muted">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-muted text-[14px]">
              Nada por aqui ainda. Crie seu primeiro post.
            </div>
            <div className="mt-6">
              <Link href="/app/create">
                <Button>Criar agora</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-[12px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="text-3xl font-semibold tracking-tightest mt-2">
        {value}
      </div>
    </div>
  );
}
