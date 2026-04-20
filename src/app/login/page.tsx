"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Label } from "@/components/ui";
import { Logo } from "@/components/Logo";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const isSignup = params.get("mode") === "signup";
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const fn = isSignup
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });
    const { error } = await fn;
    setLoading(false);
    if (error) return setErr(error.message);
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="glass rounded-2xl p-8">
      <h1 className="text-2xl font-semibold tracking-tightest">
        {isSignup ? "Criar conta" : "Bem-vindo de volta"}
      </h1>
      <p className="text-muted text-[13px] mt-1">
        {isSignup ? "Começe em 30 segundos." : "Entre para continuar."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" />
        </div>
        <div className="space-y-2">
          <Label>Senha</Label>
          <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {err && <div className="text-[12px] text-red-400">{err}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "..." : isSignup ? "Criar conta" : "Entrar"}
        </Button>
      </form>

      <div className="mt-6 text-center text-[12px] text-muted">
        {isSignup ? (
          <>Já tem conta? <Link href="/login" className="text-text">Entrar</Link></>
        ) : (
          <>Ainda não tem? <Link href="/login?mode=signup" className="text-text">Criar conta</Link></>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Link href="/"><Logo size={26} /></Link>
        </div>
        <Suspense fallback={<div className="glass rounded-2xl p-8 h-[380px]" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
