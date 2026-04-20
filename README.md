# Iactor

Social media on autopilot. Gere imagens, copys e legendas com IA e agende publicações no Instagram automaticamente.

Stack: **Next.js 14** (App Router) · **Supabase** (auth + db + storage) · **OpenAI** (texto + imagem) · **Instagram Graph API** · **Vercel** (deploy + cron).

## Stack do design

- Inter, dark mode, gradient mesh sutil
- Acento único: lima neon (`#E8FF59`)
- Tipografia tight (`tracking-tightest`), poucos botões, fluxos de 3 passos
- Glassmorphism discreto, hairlines em vez de bordas grossas

---

## 1. Supabase

1. Crie um projeto em https://supabase.com
2. Em **SQL Editor**, cole e execute o conteúdo de `supabase/schema.sql`
3. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 2. OpenAI

Pegue sua chave em https://platform.openai.com/api-keys → `OPENAI_API_KEY`.

A geração de imagem usa `gpt-image-1` (DALL·E mais recente). Texto usa `gpt-4o-mini`.

## 3. Instagram (Meta Graph API)

Para publicar automaticamente é preciso:

- Conta **Instagram Business** vinculada a uma **Página do Facebook**
- App em https://developers.facebook.com com produtos:
  - **Facebook Login**
  - **Instagram Graph API**
- Permissões: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`
- Em **Facebook Login → Settings**, adicione como Valid OAuth Redirect URI:
  `https://SEU-DOMINIO.vercel.app/api/instagram/callback`

Variáveis:
```
META_APP_ID=
META_APP_SECRET=
NEXT_PUBLIC_META_APP_ID=  # mesmo valor de META_APP_ID
```

## 4. Local

```bash
cp .env.example .env.local
# preencha as variáveis
npm install
npm run dev
```

Abra http://localhost:3000

## 5. Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Ou conecte o repo no painel da Vercel. Configure as mesmas variáveis de ambiente.

Defina também:
- `CRON_SECRET` — qualquer string longa aleatória. A Vercel injeta ela no header `Authorization: Bearer <CRON_SECRET>` para o cron.

O `vercel.json` já agenda `/api/cron/publish` a cada minuto. Isso faz a varredura dos posts agendados e publica via Instagram Graph API.

> ⚠️ Cron por minuto exige plano **Pro** da Vercel. No Hobby use `*/15 * * * *`.

---

## Estrutura

```
src/
  app/
    page.tsx                  # landing
    login/page.tsx            # auth
    app/
      layout.tsx              # shell autenticado
      page.tsx                # dashboard
      create/page.tsx         # gerar + agendar (3 passos)
      schedule/page.tsx       # lista de posts
      settings/page.tsx       # conexão IG + logout
    api/
      generate/text/route.ts  # gpt-4o-mini
      generate/image/route.ts # gpt-image-1 → storage
      posts/route.ts          # CRUD agendamento
      instagram/callback/route.ts
      cron/publish/route.ts   # vercel cron
  lib/
    supabase/{client,server,admin}.ts
    openai.ts
    instagram.ts
  components/
    ui.tsx                    # Button/Input/Textarea/Card/Label
    Logo.tsx
supabase/schema.sql
vercel.json
```

## Fluxo do usuário

1. **Login** com email/senha (Supabase Auth)
2. **Conectar Instagram** em Configurações
3. **Criar** → escreve uma ideia → IA gera imagem + legenda → revisa → escolhe data
4. Cron da Vercel publica no horário marcado
