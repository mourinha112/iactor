import * as React from "react";

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "secondary";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[13px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary:
      "bg-accent text-bg hover:brightness-95 shadow-[0_0_0_1px_rgba(232,255,89,0.4),0_8px_30px_-10px_rgba(232,255,89,0.5)]",
    secondary:
      "bg-elevated text-text hairline hover:bg-[#1a1a1f]",
    ghost: "text-muted hover:text-text"
  } as const;
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-11 px-4 rounded-xl bg-elevated hairline text-text placeholder:text-muted text-[14px] outline-none focus:border-[#2a2a30] transition ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-elevated hairline text-text placeholder:text-muted text-[14px] outline-none focus:border-[#2a2a30] transition resize-none ${props.className ?? ""}`}
    />
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[12px] uppercase tracking-wider text-muted">{children}</label>;
}
