import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui";

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/login?mode=signup">
            <Button>Começar</Button>
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-12">
        <span className="text-[12px] uppercase tracking-[0.2em] text-muted mb-6">
          Social media on autopilot
        </span>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tightest max-w-4xl leading-[1.02]">
          Crie, gere e agende.<br />
          <span className="text-muted">Automatize sua operação de marketing.</span>
        </h1>
        <p className="mt-6 text-muted text-[15px] max-w-xl leading-relaxed">
          Iactor escreve copys, gera imagens e publica no seu Instagram
          automaticamente. Você só decide quando.
        </p>
        <div className="mt-10 flex items-center gap-3">
          <Link href="/login?mode=signup">
            <Button>Criar conta gratuita →</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Já tenho conta</Button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl w-full">
          {[
            { t: "Texto", d: "Copys, legendas e roteiros gerados em segundos." },
            { t: "Imagem", d: "Visuais únicos a partir de uma simples descrição." },
            { t: "Agenda", d: "Publicação automática no Instagram, na hora certa." }
          ].map((f) => (
            <div key={f.t} className="glass rounded-2xl p-6 text-left">
              <div className="text-[12px] uppercase tracking-wider text-muted">
                {f.t}
              </div>
              <div className="mt-2 text-[14px] leading-relaxed">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-muted text-[12px] py-8">
        © {new Date().getFullYear()} Iactor
      </footer>
    </main>
  );
}
