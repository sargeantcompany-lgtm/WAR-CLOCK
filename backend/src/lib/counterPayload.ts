const DEFAULT_SMOOTHING_HOURS = 24;
const DOCUMENTED_COUNTER_DISCLAIMER =
  "Animation reflects smoothing between documented updates only. It is not live real-time casualty reporting or confirmation of new events.";

type CounterSource = {
  displayedKilledTotal?: number | null;
  smoothingHours?: number | null;
  updatedAt?: Date | null;
};

type CasualtySource = {
  killedBest?: number | null;
  killedMax?: number | null;
  killedMin?: number | null;
  updatedAt?: Date | null;
};

export type DocumentedCounterPayload = {
  documentedTotal: number;
  previousDisplayedTotal: number;
  documentedIncrease: number;
  smoothingWindowHours: number;
  lastUpdatedAt: Date | null;
  displayMode: "documented-smoothed";
  disclaimer: string;
  isRevision: boolean;
};

function resolveDocumentedTotal(
  latestSnapshot: CounterSource | null | undefined,
  latestCasualty: CasualtySource | null | undefined,
) {
  if (latestSnapshot?.displayedKilledTotal !== null && latestSnapshot?.displayedKilledTotal !== undefined) {
    return latestSnapshot.displayedKilledTotal;
  }

  if (latestCasualty?.killedBest !== null && latestCasualty?.killedBest !== undefined) {
    return latestCasualty.killedBest;
  }

  if (latestCasualty?.killedMax !== null && latestCasualty?.killedMax !== undefined) {
    return latestCasualty.killedMax;
  }

  if (latestCasualty?.killedMin !== null && latestCasualty?.killedMin !== undefined) {
    return latestCasualty.killedMin;
  }

  return null;
}

export function buildDocumentedCounterPayload(
  latestSnapshot: CounterSource | null | undefined,
  previousSnapshot: CounterSource | null | undefined,
  latestCasualty: CasualtySource | null | undefined,
): DocumentedCounterPayload | null {
  const documentedTotal = resolveDocumentedTotal(latestSnapshot, latestCasualty);

  if (documentedTotal === null) {
    return null;
  }

  const previousDisplayedTotal =
    previousSnapshot?.displayedKilledTotal !== null &&
    previousSnapshot?.displayedKilledTotal !== undefined
      ? previousSnapshot.displayedKilledTotal
      : documentedTotal;

  const isRevision = documentedTotal < previousDisplayedTotal;
  const documentedIncrease = isRevision
    ? 0
    : Math.max(documentedTotal - previousDisplayedTotal, 0);

  return {
    documentedTotal,
    previousDisplayedTotal,
    documentedIncrease,
    smoothingWindowHours: latestSnapshot?.smoothingHours ?? DEFAULT_SMOOTHING_HOURS,
    lastUpdatedAt: latestSnapshot?.updatedAt ?? latestCasualty?.updatedAt ?? null,
    displayMode: "documented-smoothed",
    disclaimer: DOCUMENTED_COUNTER_DISCLAIMER,
    isRevision,
  };
}

export function getCounterDisclaimer() {
  return DOCUMENTED_COUNTER_DISCLAIMER;
}

export function getDefaultSmoothingHours() {
  return DEFAULT_SMOOTHING_HOURS;
}
