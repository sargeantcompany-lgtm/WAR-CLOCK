import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { asArray, formatDate, formatDateTime, formatNumber } from "@/lib/format";
import type { ConflictDetail } from "@/lib/types";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";

export function ConflictDetailPage() {
  const { slug = "" } = useParams();
  const [conflict, setConflict] = useState<ConflictDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await api.getConflict(slug);

        if (!active) {
          return;
        }

        setConflict(response.conflict);
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
  }, [slug]);

  if (loading) {
    return <div className="text-sm text-fog">Loading conflict dossier...</div>;
  }

  if (error || !conflict) {
    return (
      <div className="rounded-2xl border border-ember/30 bg-ember/10 p-6 text-sm text-amber-100">
        {error ?? "Conflict not found"}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7 shadow-panel sm:p-9">
        <Link to="/" className="text-[11px] uppercase tracking-[0.3em] text-signal/90">
          Back to index
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-fog/80">
            {conflict.region}
          </p>
          <StatusPill status={conflict.status} />
        </div>
        <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
          {conflict.name}
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-fog">
          {conflict.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {asArray(conflict.tags).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-fog"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="All Deaths Estimate"
          value={
            <AnimatedCounter
              counter={conflict.latestCounter}
              toneClassName="text-ember"
              sizeClassName="text-4xl"
            />
          }
          hint={`Since ${formatDate(conflict.startDate)}. Estimate dated ${formatDate(conflict.latestCasualties?.recordDate)}.`}
          tone="ember"
        />
        <StatCard
          label="Official Or UN Count"
          value={formatNumber(conflict.latestCasualties?.officialDeathsBest)}
          hint={
            conflict.latestCasualties?.officialDeathsBest
              ? `Since ${formatDate(conflict.startDate)}. Reported as of ${formatDate(conflict.latestCasualties?.recordDate)}.`
              : "No official or UN-linked narrower count is stored for this conflict yet."
          }
          tone="signal"
        />
        <StatCard
          label="Latest Recorded All Deaths"
          value={formatNumber(conflict.latestCasualties?.allDeathsBest)}
          hint={`Casualty record date ${formatDate(conflict.latestCasualties?.recordDate)}`}
        />
        <StatCard
          label="Latest Recorded Injured"
          value={formatNumber(conflict.latestCasualties?.injuredBest)}
          hint={`Counter updated ${formatDateTime(conflict.latestCounter?.lastUpdatedAt)}`}
        />
      </section>

      <section className="rounded-[1.8rem] border border-white/10 bg-steel/85 p-6 shadow-panel">
        <SectionHeading
          eyebrow="Counter Note"
          title="Documented-smoothed display"
          description={conflict.latestCounter?.disclaimer ?? "Animated counters represent smoothing between documented updates only."}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 shadow-panel">
          <SectionHeading
            eyebrow="Sides"
            title="Conflict framing"
            description="Structured JSON fields from the backend are rendered directly for the newsroom-style detail layout."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-signal/85">
                Main Countries
              </p>
              <ul className="mt-4 space-y-2 text-sm text-fog">
                {asArray(conflict.mainCountries).map((country) => (
                  <li key={country}>{country}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-signal/85">
                Timeframe
              </p>
              <dl className="mt-4 space-y-3 text-sm text-fog">
                <div>
                  <dt className="text-white/70">Start date</dt>
                  <dd>{formatDate(conflict.startDate)}</dd>
                </div>
                <div>
                  <dt className="text-white/70">End date</dt>
                  <dd>{formatDate(conflict.endDate)}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-signal/85">
                Side A
              </p>
              <ul className="mt-4 space-y-2 text-sm text-fog">
                {asArray(conflict.sideA).map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-signal/85">
                Side B
              </p>
              <ul className="mt-4 space-y-2 text-sm text-fog">
                {asArray(conflict.sideB).map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-steel/90 p-6 shadow-panel">
          <SectionHeading
            eyebrow="Sources"
            title="Recent citations"
            description="Latest source records attached to this conflict."
          />
          <div className="mt-6 space-y-4">
            {conflict.sources.map((source) => (
              <article
                key={source.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-signal/85">
                  {source.sourceType}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                </h3>
                <p className="mt-2 text-sm text-fog">{source.publisher}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-fog/65">
                  Published {formatDate(source.publishedAt)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 shadow-panel">
        <SectionHeading
          eyebrow="Record Ledger"
          title="Latest casualty records"
          description="Recent records from the API, shown in reverse chronological order."
        />
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.26em] text-fog/70">
                <th className="pb-2 pr-6">Date</th>
                <th className="pb-2 pr-6">All Deaths</th>
                <th className="pb-2 pr-6">Official/UN</th>
                <th className="pb-2 pr-6">Injured Best</th>
                <th className="pb-2 pr-6">Child Best</th>
                <th className="pb-2">Summary</th>
              </tr>
            </thead>
            <tbody>
              {conflict.casualtyRecords.map((record) => (
                <tr key={record.id} className="text-sm text-fog">
                  <td className="rounded-l-2xl bg-black/20 px-4 py-4 text-white">
                    {formatDate(record.recordDate)}
                  </td>
                  <td className="bg-black/20 px-4 py-4">{formatNumber(record.allDeathsBest)}</td>
                  <td className="bg-black/20 px-4 py-4">
                    {formatNumber(record.officialDeathsBest)}
                  </td>
                  <td className="bg-black/20 px-4 py-4">{formatNumber(record.injuredBest)}</td>
                  <td className="bg-black/20 px-4 py-4">{formatNumber(record.childKilledBest)}</td>
                  <td className="rounded-r-2xl bg-black/20 px-4 py-4">
                    {record.sourceSummary ?? record.notes ?? "Not available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
