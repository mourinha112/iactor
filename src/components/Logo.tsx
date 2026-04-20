export function Logo({ size = 22 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="#EDEDEF" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" fill="#E8FF59" />
      </svg>
      <span className="text-text tracking-tightest font-semibold text-[15px]">
        Iactor
      </span>
    </div>
  );
}
