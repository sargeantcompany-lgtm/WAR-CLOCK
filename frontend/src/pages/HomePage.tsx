import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, API_BASE_URL } from "@/lib/api";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { ConflictListItem, GlobalCounter } from "@/lib/types";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";

export function HomePage() {
  const [conflicts, setConflicts] = useState<ConflictListItem[]>([]);
  const [globalCounter, setGlobalCounter] = useState<GlobalCounter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [conflictsResponse, globalResponse] = await Promise.all([
          api.getConflicts(),
          api.getGlobalCounter(),
        ]);

        if (!active) {
          return;
        }

        setConflicts(conflictsResponse.conflicts);
        setGlobalCounter(globalResponse);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Failed to load");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="text-sm text-fog">Loading newsroom dashboard...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-ember/30 bg-ember/10 p-6 text-sm text-amber-100">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-5 lg:grid-cols-[1.5fr,1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(240,195,106,0.14),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-7 shadow-panel sm:p-9">
          <p className="text-[11px] uppercase tracking-[0.35em] text-signal/90">
            Front Page
          </p>
          <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-white sm:text-5xl">
            A restrained daily ledger of documented conflict casualties.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-fog">
            This interface presents the latest stored totals, source-linked records,
            and smoothed display counters from the backend. Seeded records in local
            development are clearly marked as demo placeholders.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Active Conflicts"
              value={formatNumber(globalCounter?.activeConflicts ?? 0)}
              hint="Conflicts currently surfaced by the public API."
            />
            <StatCard
              label="Documented Killed Total"
              value={
                <AnimatedCounter
                  counter={globalCounter}
                  toneClassName="text-ember"
                  sizeClassName="text-4xl"
                />
              }
              hint="Sum of documented totals across active conflicts."
              tone="ember"
            />
            <StatCard
              label="Latest Recorded Increase"
              value={formatNumber(globalCounter?.documentedIncrease ?? 0)}
              hint={
                globalCounter?.isRevision
                  ? "At least one active conflict is currently showing a documented revision."
                  : `Last updated ${formatDateTime(globalCounter?.lastUpdatedAt ?? null)}`
              }
              tone="signal"
            />
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-steel/85 p-7 shadow-panel">
          <SectionHeading
            eyebrow="Desk Note"
            title="What the backend is serving"
            description="Public cards combine the latest casualty record with the latest counter snapshot for each active conflict."
          />
          <dl className="mt-8 space-y-4 text-sm text-fog">
            <div className="border-t border-white/10 pt-4">
              <dt className="uppercase tracking-[0.2em] text-white/70">API Base</dt>
              <dd className="mt-2 break-all text-signal">{API_BASE_URL}</dd>
            </div>
            <div className="border-t border-white/10 pt-4">
              <dt className="uppercase tracking-[0.2em] text-white/70">
                Counter Window
              </dt>
              <dd className="mt-2">
                {formatNumber(globalCounter?.smoothingWindowHours ?? 24)} hour smoothing
                snapshots from the backend.
              </dd>
            </div>
            <div className="border-t border-white/10 pt-4">
              <dt className="uppercase tracking-[0.2em] text-white/70">
                Counter Mode
              </dt>
              <dd className="mt-2">{globalCounter?.disclaimer ?? "Documented-smoothed counters only."}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Conflict Index"
          title="Live public cards"
          description="Cards are sorted by featured status, editorial priority, and name, matching the backend ordering."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {conflicts.map((conflict) => (
            <Link
              key={conflict.id}
              to={`/conflicts/${conflict.slug}`}
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-signal/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-signal/85">
                    {conflict.region}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl text-white">
                    {conflict.shortName}
                  </h3>
                </div>
                <StatusPill status={conflict.status} />
              </div>

              <p className="mt-4 text-sm leading-7 text-fog">{conflict.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-fog/75">
                    Documented Total
                  </p>
                  <AnimatedCounter
                    counter={conflict.latestCounter}
                    toneClassName="text-ember"
                    sizeClassName="text-3xl"
                  />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-fog/75">
                    Documented Increase
                  </p>
                  <p className="mt-2 font-serif text-3xl text-signal">
                    {formatNumber(conflict.latestCounter?.documentedIncrease)}
                  </p>
                  {conflict.latestCounter?.isRevision ? (
                    <p className="mt-2 text-xs leading-6 text-fog/80">
                      Revision case: latest documented total is lower than the prior displayed total, so no upward animation is shown.
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-fog/70">
                Latest casualty record: {formatDateTime(conflict.latestCasualties?.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
