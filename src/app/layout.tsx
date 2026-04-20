import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iactor — Social media on autopilot",
  description:
    "Gere imagens, copys, legendas e agende posts no Instagram. Tudo num só lugar.",
  icons: { icon: "/favicon.svg" }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="mesh min-h-screen">{children}</body>
    </html>
  );
}
