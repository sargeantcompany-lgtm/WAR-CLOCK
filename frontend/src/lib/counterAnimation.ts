import type { LatestCounter } from "./types";

export function isValidDateString(value: string | null | undefined) {
  return Boolean(value && !Number.isNaN(new Date(value).getTime()));
}

export function getElapsedMilliseconds(value: string | null | undefined, now = Date.now()) {
  if (!isValidDateString(value)) {
    return null;
  }

  return Math.max(now - new Date(value as string).getTime(), 0);
}

export function getAnimationProgress(
  lastUpdatedAt: string | null | undefined,
  smoothingWindowHours: number,
  now = Date.now(),
) {
  const elapsedMilliseconds = getElapsedMilliseconds(lastUpdatedAt, now);

  if (elapsedMilliseconds === null) {
    return 1;
  }

  const durationMilliseconds = Math.max(smoothingWindowHours, 0) * 60 * 60 * 1000;

  if (durationMilliseconds <= 0) {
    return 1;
  }

  return Math.min(elapsedMilliseconds / durationMilliseconds, 1);
}

export function interpolateDocumentedValue(
  previousDisplayedTotal: number,
  documentedTotal: number,
  progress: number,
) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const interpolatedValue =
    previousDisplayedTotal +
    (documentedTotal - previousDisplayedTotal) * clampedProgress;

  return Math.min(Math.round(interpolatedValue), documentedTotal);
}

export function resolveAnimatedCounterValue(
  counter: LatestCounter | null | undefined,
  now = Date.now(),
) {
  if (!counter) {
    return null;
  }

  if (
    counter.documentedIncrease <= 0 ||
    counter.isRevision ||
    !isValidDateString(counter.lastUpdatedAt)
  ) {
    return counter.documentedTotal;
  }

  const progress = getAnimationProgress(
    counter.lastUpdatedAt,
    counter.smoothingWindowHours,
    now,
  );

  return interpolateDocumentedValue(
    counter.previousDisplayedTotal,
    counter.documentedTotal,
    progress,
  );
}
