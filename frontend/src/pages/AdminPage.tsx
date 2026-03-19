import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { AdminConflict } from "@/lib/types";
import { SectionHeading } from "@/components/SectionHeading";

type AdminMode = "conflict" | "casualty" | "source" | "snapshot";

const conflictTemplate = {
  slug: "",
  name: "",
  shortName: "",
  description: "",
  region: "",
  status: "ACTIVE",
  startDate: "",
  endDate: "",
  mainCountriesJson: "[\"Sample country\"]",
  sideAJson: "[\"Sample side A\"]",
  sideBJson: "[\"Sample side B\"]",
  tagsJson: "[\"sample\"]",
  heroLabel: "Sample data only",
  priority: "0",
  featured: false,
};

const casualtyTemplate = {
  conflictId: "",
  recordDate: "",
  killedBest: "",
  injuredBest: "",
  civilianKilledBest: "",
  childKilledBest: "",
  notes: "Sample admin entry",
  sourceSummary: "Sample source summary",
};

const sourceTemplate = {
  conflictId: "",
  sourceType: "MEDIA",
  title: "",
  publisher: "",
  url: "",
  publishedAt: "",
  accessedAt: "",
  reliabilityScore: "3",
  notes: "Sample source note",
};

const snapshotTemplate = {
  conflictId: "",
  snapshotDate: "",
  displayedKilledTotal: "",
  displayedInjuredTotal: "",
  dailyIncreaseKilled: "",
  dailyIncreaseInjured: "",
  smoothingHours: "24",
};

function toOptionalNumber(value: string) {
  return value.trim() ? Number(value) : null;
}

export function AdminPage() {
  const [adminToken, setAdminToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<AdminConflict[]>([]);
  const [mode, setMode] = useState<AdminMode>("conflict");
  const [conflictForm, setConflictForm] = useState(conflictTemplate);
  const [casualtyForm, setCasualtyForm] = useState(casualtyTemplate);
  const [sourceForm, setSourceForm] = useState(sourceTemplate);
  const [snapshotForm, setSnapshotForm] = useState(snapshotTemplate);

  async function loadAdminConflicts(token: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getAdminConflicts(token);
      setConflicts(response.conflicts);
      setAuthorized(true);
      setSuccess("Admin token accepted.");
    } catch (loadError) {
      setAuthorized(false);
      setError(loadError instanceof Error ? loadError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedToken = window.localStorage.getItem("war-clock-admin-token");

    if (!storedToken) {
      return;
    }

    setAdminToken(storedToken);
    void loadAdminConflicts(storedToken);
  }, []);

  async function handleAuthorize(event: FormEvent) {
    event.preventDefault();
    setSuccess(null);
    window.localStorage.setItem("war-clock-admin-token", adminToken);
    await loadAdminConflicts(adminToken);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "conflict") {
        await api.createConflict(adminToken, {
          ...conflictForm,
          startDate: conflictForm.startDate || null,
          endDate: conflictForm.endDate || null,
          priority: Number(conflictForm.priority),
        });
        setConflictForm(conflictTemplate);
        setSuccess("Conflict created.");
      }

      if (mode === "casualty") {
        await api.createCasualty(adminToken, Number(casualtyForm.conflictId), {
          recordDate: casualtyForm.recordDate,
          killedBest: toOptionalNumber(casualtyForm.killedBest),
          injuredBest: toOptionalNumber(casualtyForm.injuredBest),
          civilianKilledBest: toOptionalNumber(casualtyForm.civilianKilledBest),
          childKilledBest: toOptionalNumber(casualtyForm.childKilledBest),
          notes: casualtyForm.notes || null,
          sourceSummary: casualtyForm.sourceSummary || null,
        });
        setCasualtyForm(casualtyTemplate);
        setSuccess("Casualty record created.");
      }

      if (mode === "source") {
        await api.createSource(adminToken, Number(sourceForm.conflictId), {
          sourceType: sourceForm.sourceType,
          title: sourceForm.title,
          publisher: sourceForm.publisher,
          url: sourceForm.url,
          publishedAt: sourceForm.publishedAt || null,
          accessedAt: sourceForm.accessedAt || null,
          reliabilityScore: toOptionalNumber(sourceForm.reliabilityScore),
          notes: sourceForm.notes || null,
        });
        setSourceForm(sourceTemplate);
        setSuccess("Source created.");
      }

      if (mode === "snapshot") {
        await api.createSnapshot(adminToken, Number(snapshotForm.conflictId), {
          snapshotDate: snapshotForm.snapshotDate,
          displayedKilledTotal: Number(snapshotForm.displayedKilledTotal),
          displayedInjuredTotal: toOptionalNumber(snapshotForm.displayedInjuredTotal),
          dailyIncreaseKilled: toOptionalNumber(snapshotForm.dailyIncreaseKilled),
          dailyIncreaseInjured: toOptionalNumber(snapshotForm.dailyIncreaseInjured),
          smoothingHours: Number(snapshotForm.smoothingHours),
        });
        setSnapshotForm(snapshotTemplate);
        setSuccess("Snapshot created.");
      }

      await loadAdminConflicts(adminToken);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-5 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 shadow-panel">
          <SectionHeading
            eyebrow="Admin Desk"
            title="Protected control surface"
            description="Requests are sent with the x-admin-token header and never expose the token in public responses."
          />
          <form className="mt-7 space-y-4" onSubmit={handleAuthorize}>
            <label className="block">
              <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-fog/75">
                Admin token
              </span>
              <input
                type="password"
                value={adminToken}
                onChange={(event) => setAdminToken(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-signal/50"
                placeholder="change_this_admin_token"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#ffd993]"
            >
              {loading ? "Connecting..." : "Authorize"}
            </button>
          </form>
          {error ? (
            <p className="mt-4 rounded-2xl border border-ember/30 bg-ember/10 p-4 text-sm text-amber-100">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              {success}
            </p>
          ) : null}
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-steel/90 p-6 shadow-panel">
          <SectionHeading
            eyebrow="Filed Conflicts"
            title="Current admin-visible records"
            description="Loaded from the protected admin API."
          />
          <div className="mt-6 grid gap-3">
            {authorized ? (
              conflicts.map((conflict) => (
                <article
                  key={conflict.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {conflict.shortName}
                      </h3>
                      <p className="text-sm text-fog">
                        {conflict.region} • {conflict.status}
                      </p>
                    </div>
                    <div className="text-right text-xs uppercase tracking-[0.22em] text-fog/70">
                      <p>ID {conflict.id}</p>
                      <p>{formatDateTime(conflict.updatedAt)}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm text-fog">Authorize to load protected records.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 shadow-panel">
        <div className="flex flex-wrap gap-3">
          {(["conflict", "casualty", "source", "snapshot"] as AdminMode[]).map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setMode(entry)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
                mode === entry
                  ? "bg-signal text-ink"
                  : "border border-white/10 bg-black/20 text-fog"
              }`}
            >
              {entry}
            </button>
          ))}
        </div>

        <form className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          {mode === "conflict" ? (
            <>
              <Input label="Slug" value={conflictForm.slug} onChange={(value) => setConflictForm({ ...conflictForm, slug: value })} />
              <Input label="Name" value={conflictForm.name} onChange={(value) => setConflictForm({ ...conflictForm, name: value })} />
              <Input label="Short name" value={conflictForm.shortName} onChange={(value) => setConflictForm({ ...conflictForm, shortName: value })} />
              <Input label="Region" value={conflictForm.region} onChange={(value) => setConflictForm({ ...conflictForm, region: value })} />
              <Select label="Status" value={conflictForm.status} onChange={(value) => setConflictForm({ ...conflictForm, status: value })} options={["ACTIVE", "PAUSED", "ENDED"]} />
              <Input label="Priority" value={conflictForm.priority} onChange={(value) => setConflictForm({ ...conflictForm, priority: value })} />
              <Input label="Start date" value={conflictForm.startDate} onChange={(value) => setConflictForm({ ...conflictForm, startDate: value })} placeholder="2026-03-20" />
              <Input label="End date" value={conflictForm.endDate} onChange={(value) => setConflictForm({ ...conflictForm, endDate: value })} placeholder="2026-03-20" />
              <Input label="Main countries JSON" value={conflictForm.mainCountriesJson} onChange={(value) => setConflictForm({ ...conflictForm, mainCountriesJson: value })} />
              <Input label="Side A JSON" value={conflictForm.sideAJson} onChange={(value) => setConflictForm({ ...conflictForm, sideAJson: value })} />
              <Input label="Side B JSON" value={conflictForm.sideBJson} onChange={(value) => setConflictForm({ ...conflictForm, sideBJson: value })} />
              <Input label="Tags JSON" value={conflictForm.tagsJson} onChange={(value) => setConflictForm({ ...conflictForm, tagsJson: value })} />
              <Input label="Hero label" value={conflictForm.heroLabel} onChange={(value) => setConflictForm({ ...conflictForm, heroLabel: value })} />
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-fog">
                <input
                  type="checkbox"
                  checked={conflictForm.featured}
                  onChange={(event) => setConflictForm({ ...conflictForm, featured: event.target.checked })}
                />
                Featured conflict
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-fog/75">
                  Description
                </span>
                <textarea
                  value={conflictForm.description}
                  onChange={(event) => setConflictForm({ ...conflictForm, description: event.target.value })}
                  className="min-h-32 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-signal/50"
                />
              </label>
            </>
          ) : null}

          {mode === "casualty" ? (
            <>
              <Input label="Conflict ID" value={casualtyForm.conflictId} onChange={(value) => setCasualtyForm({ ...casualtyForm, conflictId: value })} />
              <Input label="Record date" value={casualtyForm.recordDate} onChange={(value) => setCasualtyForm({ ...casualtyForm, recordDate: value })} placeholder="2026-03-20" />
              <Input label="Killed best" value={casualtyForm.killedBest} onChange={(value) => setCasualtyForm({ ...casualtyForm, killedBest: value })} />
              <Input label="Injured best" value={casualtyForm.injuredBest} onChange={(value) => setCasualtyForm({ ...casualtyForm, injuredBest: value })} />
              <Input label="Civilian killed best" value={casualtyForm.civilianKilledBest} onChange={(value) => setCasualtyForm({ ...casualtyForm, civilianKilledBest: value })} />
              <Input label="Child killed best" value={casualtyForm.childKilledBest} onChange={(value) => setCasualtyForm({ ...casualtyForm, childKilledBest: value })} />
              <Input label="Notes" value={casualtyForm.notes} onChange={(value) => setCasualtyForm({ ...casualtyForm, notes: value })} />
              <Input label="Source summary" value={casualtyForm.sourceSummary} onChange={(value) => setCasualtyForm({ ...casualtyForm, sourceSummary: value })} />
            </>
          ) : null}

          {mode === "source" ? (
            <>
              <Input label="Conflict ID" value={sourceForm.conflictId} onChange={(value) => setSourceForm({ ...sourceForm, conflictId: value })} />
              <Select label="Source type" value={sourceForm.sourceType} onChange={(value) => setSourceForm({ ...sourceForm, sourceType: value })} options={["UN", "NGO", "GOVERNMENT", "MEDIA", "ACADEMIC", "OTHER"]} />
              <Input label="Title" value={sourceForm.title} onChange={(value) => setSourceForm({ ...sourceForm, title: value })} />
              <Input label="Publisher" value={sourceForm.publisher} onChange={(value) => setSourceForm({ ...sourceForm, publisher: value })} />
              <Input label="URL" value={sourceForm.url} onChange={(value) => setSourceForm({ ...sourceForm, url: value })} />
              <Input label="Published at" value={sourceForm.publishedAt} onChange={(value) => setSourceForm({ ...sourceForm, publishedAt: value })} placeholder="2026-03-20" />
              <Input label="Accessed at" value={sourceForm.accessedAt} onChange={(value) => setSourceForm({ ...sourceForm, accessedAt: value })} placeholder="2026-03-20" />
              <Input label="Reliability score" value={sourceForm.reliabilityScore} onChange={(value) => setSourceForm({ ...sourceForm, reliabilityScore: value })} />
              <Input label="Notes" value={sourceForm.notes} onChange={(value) => setSourceForm({ ...sourceForm, notes: value })} />
            </>
          ) : null}

          {mode === "snapshot" ? (
            <>
              <Input label="Conflict ID" value={snapshotForm.conflictId} onChange={(value) => setSnapshotForm({ ...snapshotForm, conflictId: value })} />
              <Input label="Snapshot date" value={snapshotForm.snapshotDate} onChange={(value) => setSnapshotForm({ ...snapshotForm, snapshotDate: value })} placeholder="2026-03-20" />
              <Input label="Displayed killed total" value={snapshotForm.displayedKilledTotal} onChange={(value) => setSnapshotForm({ ...snapshotForm, displayedKilledTotal: value })} />
              <Input label="Displayed injured total" value={snapshotForm.displayedInjuredTotal} onChange={(value) => setSnapshotForm({ ...snapshotForm, displayedInjuredTotal: value })} />
              <Input label="Daily increase killed" value={snapshotForm.dailyIncreaseKilled} onChange={(value) => setSnapshotForm({ ...snapshotForm, dailyIncreaseKilled: value })} />
              <Input label="Daily increase injured" value={snapshotForm.dailyIncreaseInjured} onChange={(value) => setSnapshotForm({ ...snapshotForm, dailyIncreaseInjured: value })} />
              <Input label="Smoothing hours" value={snapshotForm.smoothingHours} onChange={(value) => setSnapshotForm({ ...snapshotForm, smoothingHours: value })} />
            </>
          ) : null}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!authorized || loading}
              className="rounded-full bg-signal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#ffd993] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : `Create ${mode}`}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function Input({ label, value, onChange, placeholder }: InputProps) {
  return (
    <label>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-fog/75">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-signal/50"
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-fog/75">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-signal/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
