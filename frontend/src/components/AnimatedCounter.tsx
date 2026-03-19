import { useEffect, useState } from "react";
import { formatDateTime, formatNumber } from "@/lib/format";
import { getAnimationProgress, resolveAnimatedCounterValue } from "@/lib/counterAnimation";
import type { LatestCounter } from "@/lib/types";

type AnimatedCounterProps = {
  counter: LatestCounter | null | undefined;
  sizeClassName?: string;
  toneClassName?: string;
  staticLabel?: string;
};

function getSupportingNote(counter: LatestCounter | null | undefined) {
  if (!counter) {
    return "No documented counter data available.";
  }

  if (counter.isRevision) {
    return "Latest documented total reflects a revision. No upward animation is applied.";
  }

  if (counter.documentedIncrease === 0) {
    return "No newer documented increase is available to animate.";
  }

  return "Animated from the last documented update — not live real-time casualty reporting.";
}

export function AnimatedCounter({
  counter,
  sizeClassName = "text-4xl",
  toneClassName = "text-white",
  staticLabel,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number | null>(() =>
    resolveAnimatedCounterValue(counter),
  );

  useEffect(() => {
    setDisplayValue(resolveAnimatedCounterValue(counter));

    if (
      !counter ||
      counter.documentedIncrease <= 0 ||
      counter.isRevision ||
      !counter.lastUpdatedAt
    ) {
      return;
    }

    let frameId = 0;

    const update = () => {
      const nextValue = resolveAnimatedCounterValue(counter);
      setDisplayValue(nextValue);

      const progress = getAnimationProgress(
        counter.lastUpdatedAt,
        counter.smoothingWindowHours,
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    frameId = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [counter]);

  if (!counter || displayValue === null) {
    return (
      <div className="space-y-2">
        <p className={`font-serif ${sizeClassName} ${toneClassName}`}>
          {staticLabel ?? "Not available"}
        </p>
        <p className="text-xs leading-6 text-fog">
          Display animates documented updates only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className={`font-serif tabular-nums ${sizeClassName} ${toneClassName}`}>
        {formatNumber(displayValue)}
      </p>
      <p className="text-xs leading-6 text-fog">
        Display animates documented updates only.
      </p>
      <p className="text-xs leading-6 text-fog/80">{getSupportingNote(counter)}</p>
      <p className="text-[11px] uppercase tracking-[0.2em] text-fog/60">
        Documented total {formatNumber(counter.documentedTotal)} • updated{" "}
        {formatDateTime(counter.lastUpdatedAt)}
      </p>
    </div>
  );
}
