"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      setEmail(u.user?.email ?? "");
      const { data } = await supabase.from("ig_accounts").select("*");
      setAccounts(data ?? []);
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function connectInstagram() {
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&redirect_uri=${encodeURIComponent(window.location.origin + "/api/instagram/callback")}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement&response_type=code`;
    window.location.href = url;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-12">
        <div className="text-[12px] uppercase tracking-wider text-muted">
          Conta
        </div>
        <h1 className="text-4xl font-semibold tracking-tightest mt-2">
          Configurações
        </h1>
      </div>

      <div className="space-y-3">
        <div className="glass rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-wider text-muted">
              Email
            </div>
            <div className="mt-1 text-[14px]">{email}</div>
          </div>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] uppercase tracking-wider text-muted">
                Instagram
              </div>
              <div className="mt-1 text-[14px]">
                {accounts.length > 0
                  ? `@${accounts[0].username} conectado`
                  : "Nenhuma conta conectada"}
              </div>
            </div>
            <Button onClick={connectInstagram}>
              {accounts.length > 0 ? "Reconectar" : "Conectar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
