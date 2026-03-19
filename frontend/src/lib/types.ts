export type LatestCasualties = {
  id: number;
  recordDate: string;
  killedBest: number | null;
  injuredBest: number | null;
  civilianKilledBest: number | null;
  childKilledBest: number | null;
  sourceSummary: string | null;
  updatedAt: string;
};

export type LatestCounter = {
  documentedTotal: number;
  previousDisplayedTotal: number;
  documentedIncrease: number;
  smoothingWindowHours: number;
  lastUpdatedAt: string | null;
  displayMode: "documented-smoothed";
  disclaimer: string;
  isRevision: boolean;
};

export type ConflictListItem = {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  region: string;
  status: "ACTIVE" | "PAUSED" | "ENDED";
  featured: boolean;
  priority: number;
  latestCasualties: LatestCasualties | null;
  latestCounter: LatestCounter | null;
};

export type SourceRecord = {
  id: number;
  sourceType: "UN" | "NGO" | "GOVERNMENT" | "MEDIA" | "ACADEMIC" | "OTHER";
  title: string;
  publisher: string;
  url: string;
  publishedAt: string | null;
  accessedAt: string | null;
  reliabilityScore: number | null;
  notes: string | null;
  updatedAt: string;
};

export type CasualtyRecord = {
  id: number;
  recordDate: string;
  killedMin: number | null;
  killedMax: number | null;
  killedBest: number | null;
  injuredMin: number | null;
  injuredMax: number | null;
  injuredBest: number | null;
  civilianKilledMin: number | null;
  civilianKilledMax: number | null;
  civilianKilledBest: number | null;
  childKilledMin: number | null;
  childKilledMax: number | null;
  childKilledBest: number | null;
  notes: string | null;
  sourceSummary: string | null;
  updatedAt: string;
};

export type ConflictDetail = ConflictListItem & {
  startDate: string | null;
  endDate: string | null;
  mainCountries: string[] | string;
  sideA: string[] | string;
  sideB: string[] | string;
  tags: string[] | string;
  heroLabel: string | null;
  sources: SourceRecord[];
  casualtyRecords: CasualtyRecord[];
};

export type GlobalCounter = {
  documentedTotal: number;
  previousDisplayedTotal: number;
  documentedIncrease: number;
  activeConflicts: number;
  lastUpdatedAt: string | null;
  smoothingWindowHours: number;
  displayMode: "documented-smoothed";
  disclaimer: string;
  isRevision: boolean;
};

export type AdminConflict = {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  status: "ACTIVE" | "PAUSED" | "ENDED";
  region: string;
  featured: boolean;
  priority: number;
  updatedAt: string;
};
