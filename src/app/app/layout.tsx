import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nav = [
    { href: "/app", label: "Início" },
    { href: "/app/create", label: "Criar" },
    { href: "/app/schedule", label: "Agenda" },
    { href: "/app/settings", label: "Conta" }
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-[220px] shrink-0 border-r border-border px-5 py-7 flex flex-col">
        <Link href="/app"><Logo /></Link>
        <nav className="mt-12 flex flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[13px] text-muted hover:text-text px-3 py-2 rounded-lg hover:bg-elevated transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto text-[11px] text-muted">{user.email}</div>
      </aside>
      <main className="flex-1 px-10 py-10 max-w-5xl">{children}</main>
    </div>
  );
}
