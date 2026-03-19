import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "signal" | "ember";
};

const toneClass = {
  default: "text-white",
  signal: "text-signal",
  ember: "text-ember",
};

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: StatCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-panel">
      <p className="text-[11px] uppercase tracking-[0.3em] text-fog/75">{label}</p>
      <div className={`mt-3 ${toneClass[tone]}`}>{value}</div>
      {hint ? <p className="mt-3 text-sm text-fog">{hint}</p> : null}
    </article>
  );
}
