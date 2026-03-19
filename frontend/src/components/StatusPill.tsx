type StatusPillProps = {
  status: "ACTIVE" | "PAUSED" | "ENDED";
};

const styles: Record<StatusPillProps["status"], string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25",
  PAUSED: "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/25",
  ENDED: "bg-white/10 text-fog ring-1 ring-white/15",
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}
