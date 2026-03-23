import type { PrismaClient } from "@prisma/client";

type ConflictStatusValue = "ACTIVE" | "PAUSED" | "ENDED";
type SourceTypeValue =
  | "UN"
  | "NGO"
  | "GOVERNMENT"
  | "MEDIA"
  | "ACADEMIC"
  | "OTHER";

type BootstrapConflict = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  region: string;
  status: ConflictStatusValue;
  startDate: Date;
  mainCountriesJson: string;
  sideAJson: string;
  sideBJson: string;
  tagsJson: string;
  heroLabel: string;
  priority: number;
  featured: boolean;
  casualty: {
    recordDate: Date;
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
    notes: string;
    sourceSummary: string;
  };
  source: {
    sourceType: SourceTypeValue;
    title: string;
    publisher: string;
    url: string;
    publishedAt: Date;
    accessedAt: Date;
    reliabilityScore: number;
    notes: string;
  };
  snapshots: Array<{
    snapshotDate: Date;
    displayedKilledTotal: number;
    displayedInjuredTotal: number | null;
    dailyIncreaseKilled: number | null;
    dailyIncreaseInjured: number | null;
    smoothingHours: number;
  }>;
};

const bootstrapConflicts: BootstrapConflict[] = [
  {
    slug: "gaza",
    name: "Gaza Strip War",
    shortName: "Gaza",
    description:
      "Starter record sourced from UNICEF State of Palestine humanitarian reporting. Figures should be updated as newer official reporting is published.",
    region: "Middle East",
    status: "ACTIVE",
    startDate: new Date("2023-10-07"),
    mainCountriesJson: JSON.stringify(["Palestine", "Israel"]),
    sideAJson: JSON.stringify(["Hamas", "Allied armed groups"]),
    sideBJson: JSON.stringify(["Israel"]),
    tagsJson: JSON.stringify(["gaza", "middle-east", "unicef", "starter-data"]),
    heroLabel: "UNICEF starter source",
    priority: 100,
    featured: true,
    casualty: {
      recordDate: new Date("2026-02-03"),
      killedMin: 71803,
      killedMax: 71803,
      killedBest: 71803,
      injuredMin: 171230,
      injuredMax: 171230,
      injuredBest: 171230,
      civilianKilledMin: 71803,
      civilianKilledMax: 71803,
      civilianKilledBest: 71803,
      childKilledMin: 21289,
      childKilledMax: 21289,
      childKilledBest: 21289,
      notes:
        "Broad all-deaths estimate currently uses the same UNICEF-cited reported toll as the official count. Replace this when a stronger independent all-deaths methodology is selected.",
      sourceSummary:
        "All deaths estimate: 71,803 reported killed. Official/UN-linked count: 71,803 reported killed in Gaza as of 3 February 2026.",
    },
    source: {
      sourceType: "UN",
      title: "UNICEF State of Palestine Humanitarian Situation Update",
      publisher: "UNICEF State of Palestine",
      url: "https://www.unicef.org/sop/reports/unicef-state-palestine-humanitarian-situation-update",
      publishedAt: new Date("2026-02-05"),
      accessedAt: new Date("2026-03-23"),
      reliabilityScore: 5,
      notes:
        "Starter citation sourced from UNICEF State of Palestine, reporting period 5 February 2026.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-02-02"),
        displayedKilledTotal: 71803,
        displayedInjuredTotal: 171230,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-02-03"),
        displayedKilledTotal: 71803,
        displayedInjuredTotal: 171230,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "ukraine",
    name: "Russia-Ukraine War",
    shortName: "Ukraine",
    description:
      "Starter record showing a broader war-deaths estimate alongside the narrower OHCHR verified civilian death count for Ukraine.",
    region: "Eastern Europe",
    status: "ACTIVE",
    startDate: new Date("2022-02-24"),
    mainCountriesJson: JSON.stringify(["Ukraine", "Russia"]),
    sideAJson: JSON.stringify(["Ukraine"]),
    sideBJson: JSON.stringify(["Russia"]),
    tagsJson: JSON.stringify(["ukraine", "europe", "ohchr", "starter-data"]),
    heroLabel: "OHCHR starter source",
    priority: 95,
    featured: true,
    casualty: {
      recordDate: new Date("2026-02-24"),
      killedMin: 160000,
      killedMax: 165000,
      killedBest: 165000,
      injuredMin: 41378,
      injuredMax: 41378,
      injuredBest: 41378,
      civilianKilledMin: 15172,
      civilianKilledMax: 15172,
      civilianKilledBest: 15172,
      childKilledMin: 766,
      childKilledMax: 766,
      childKilledBest: 766,
      notes:
        "All-deaths estimate reflects a broader war-loss estimate for Ukraine. Official count is OHCHR's verified civilian death toll as of 31 January 2026. The two numbers measure different scopes and are shown side by side on purpose.",
      sourceSummary:
        "All deaths estimate: 165,000. Official/UN count: 15,172 verified civilian deaths in Ukraine as of 31 January 2026.",
    },
    source: {
      sourceType: "MEDIA",
      title: "What we know about Russian losses after three years of the war in Ukraine",
      publisher: "Mediazona",
      url: "https://en.zona.media/article/2025/02/24/losses",
      publishedAt: new Date("2025-02-24"),
      accessedAt: new Date("2026-03-23"),
      reliabilityScore: 4,
      notes:
        "Broader war-loss estimate source. Official OHCHR civilian count is stored separately in the casualty record fields and summary text.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-02-23"),
        displayedKilledTotal: 165000,
        displayedInjuredTotal: 41378,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-02-24"),
        displayedKilledTotal: 165000,
        displayedInjuredTotal: 41378,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "sudan",
    name: "Sudan War",
    shortName: "Sudan",
    description:
      "Starter record sourced from UN reporting on civilian casualties in Sudan. Injury total is inferred from total casualties minus documented deaths in the cited report.",
    region: "North Africa",
    status: "ACTIVE",
    startDate: new Date("2023-04-15"),
    mainCountriesJson: JSON.stringify(["Sudan"]),
    sideAJson: JSON.stringify(["Sudanese Armed Forces"]),
    sideBJson: JSON.stringify(["Rapid Support Forces"]),
    tagsJson: JSON.stringify(["sudan", "africa", "un", "starter-data"]),
    heroLabel: "UN starter source",
    priority: 90,
    featured: false,
    casualty: {
      recordDate: new Date("2025-06-30"),
      killedMin: 3384,
      killedMax: 3384,
      killedBest: 3384,
      injuredMin: 854,
      injuredMax: 854,
      injuredBest: 854,
      civilianKilledMin: 3384,
      civilianKilledMax: 3384,
      civilianKilledBest: 3384,
      childKilledMin: null,
      childKilledMax: null,
      childKilledBest: null,
      notes:
        "UN report published 19 September 2025 covering 1 January to 30 June 2025. Injuries are inferred by subtracting documented deaths from documented civilian casualties.",
      sourceSummary:
        "UN Human Rights documented at least 3,384 civilian deaths and 4,238 civilian casualties in Sudan between 1 January and 30 June 2025.",
    },
    source: {
      sourceType: "UN",
      title: "Sudan crisis deepens amid rising civilian casualties, growing ethnic violence and grim humanitarian situation - UN report",
      publisher: "United Nations in Sudan",
      url: "https://sudan.un.org/en/301876-sudan-crisis-deepens-amid-rising-civilian-casualties-growing-ethnic-violence-and-grim",
      publishedAt: new Date("2025-09-19"),
      accessedAt: new Date("2026-03-23"),
      reliabilityScore: 5,
      notes:
        "Starter citation sourced from UN reporting on the OHCHR Sudan report.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2025-06-29"),
        displayedKilledTotal: 3384,
        displayedInjuredTotal: 854,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2025-06-30"),
        displayedKilledTotal: 3384,
        displayedInjuredTotal: 854,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "myanmar",
    name: "Myanmar Civil War",
    shortName: "Myanmar",
    description:
      "Starter record sourced from OHCHR's annual update on the human rights situation in Myanmar in 2025. Civilian death figures are underestimates and should be refreshed as newer reporting arrives.",
    region: "Southeast Asia",
    status: "ACTIVE",
    startDate: new Date("2021-02-01"),
    mainCountriesJson: JSON.stringify(["Myanmar"]),
    sideAJson: JSON.stringify(["Myanmar military"]),
    sideBJson: JSON.stringify(["Anti-military armed groups", "Ethnic armed organizations"]),
    tagsJson: JSON.stringify(["myanmar", "asia", "ohchr", "starter-data"]),
    heroLabel: "OHCHR starter source",
    priority: 85,
    featured: false,
    casualty: {
      recordDate: new Date("2025-12-31"),
      killedMin: 7646,
      killedMax: 7646,
      killedBest: 7646,
      injuredMin: null,
      injuredMax: null,
      injuredBest: null,
      civilianKilledMin: 7646,
      civilianKilledMax: 7646,
      civilianKilledBest: 7646,
      childKilledMin: 982,
      childKilledMax: 982,
      childKilledBest: 982,
      notes:
        "OHCHR annual update published February 2026 reported a minimum of 7,646 civilians killed since the February 2021 coup, including 982 children and 1,616 women.",
      sourceSummary:
        "OHCHR reported that at least 7,646 civilians had been killed in Myanmar since the February 2021 coup as of the end of 2025.",
    },
    source: {
      sourceType: "UN",
      title: "2026: Update on the Human Rights Situation in Myanmar in 2025",
      publisher: "OHCHR Regional Office for South-East Asia",
      url: "https://bangkok.ohchr.org/sites/default/files/documents/2026-02/ohchr_myanmar_annual_update_2025.pdf",
      publishedAt: new Date("2026-02-27"),
      accessedAt: new Date("2026-03-23"),
      reliabilityScore: 5,
      notes:
        "Starter citation sourced from OHCHR annual update published in February 2026.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2025-12-30"),
        displayedKilledTotal: 7646,
        displayedInjuredTotal: null,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: null,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2025-12-31"),
        displayedKilledTotal: 7646,
        displayedInjuredTotal: null,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: null,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "iraq",
    name: "Iraq Insurgency and Security Crisis",
    shortName: "Iraq",
    description:
      "Starter record showing a broad Iraq Body Count total alongside a narrower documented civilian count, rather than a limited single-quarter UNAMI figure.",
    region: "Middle East",
    status: "PAUSED",
    startDate: new Date("2014-01-01"),
    mainCountriesJson: JSON.stringify(["Iraq"]),
    sideAJson: JSON.stringify(["Government of Iraq", "Security forces"]),
    sideBJson: JSON.stringify(["ISIL", "Unidentified armed groups"]),
    tagsJson: JSON.stringify(["iraq", "middle-east", "unami", "starter-data"]),
    heroLabel: "UNAMI starter source",
    priority: 70,
    featured: false,
    casualty: {
      recordDate: new Date("2026-02-28"),
      killedMin: 300000,
      killedMax: 300000,
      killedBest: 300000,
      injuredMin: 169,
      injuredMax: 169,
      injuredBest: 169,
      civilianKilledMin: 187499,
      civilianKilledMax: 211046,
      civilianKilledBest: 211046,
      childKilledMin: 12,
      childKilledMax: 12,
      childKilledBest: 12,
      notes:
        "All-deaths estimate uses Iraq Body Count's running total including combatants. Official/narrower count uses Iraq Body Count's documented civilian deaths from violence since 2003.",
      sourceSummary:
        "All deaths estimate: 300,000. Official/documented civilian count: 187,499-211,046 deaths from violence since 2003.",
    },
    source: {
      sourceType: "OTHER",
      title: "Iraq Body Count",
      publisher: "Iraq Body Count",
      url: "https://www.iraqbodycount.org/",
      publishedAt: new Date("2026-02-28"),
      accessedAt: new Date("2026-03-23"),
      reliabilityScore: 4,
      notes:
        "Broader all-deaths and documented civilian count source for Iraq.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-02-27"),
        displayedKilledTotal: 300000,
        displayedInjuredTotal: 169,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-02-28"),
        displayedKilledTotal: 300000,
        displayedInjuredTotal: 169,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
    ],
  },
];

export async function seedBootstrapData(prisma: PrismaClient) {
  let insertedCount = 0;

  for (const item of bootstrapConflicts) {
    const existingConflict = await prisma.conflict.findUnique({
      where: { slug: item.slug },
      select: { id: true },
    });
    const conflict = existingConflict
      ? await prisma.conflict.update({
          where: { id: existingConflict.id },
          data: {
            name: item.name,
            shortName: item.shortName,
            description: item.description,
            region: item.region,
            status: item.status,
            startDate: item.startDate,
            mainCountriesJson: item.mainCountriesJson,
            sideAJson: item.sideAJson,
            sideBJson: item.sideBJson,
            tagsJson: item.tagsJson,
            heroLabel: item.heroLabel,
            priority: item.priority,
            featured: item.featured,
          },
        })
      : await prisma.conflict.create({
          data: {
            slug: item.slug,
            name: item.name,
            shortName: item.shortName,
            description: item.description,
            region: item.region,
            status: item.status,
            startDate: item.startDate,
            mainCountriesJson: item.mainCountriesJson,
            sideAJson: item.sideAJson,
            sideBJson: item.sideBJson,
            tagsJson: item.tagsJson,
            heroLabel: item.heroLabel,
            priority: item.priority,
            featured: item.featured,
          },
        });

    await prisma.casualtyRecord.deleteMany({
      where: { conflictId: conflict.id },
    });
    await prisma.source.deleteMany({
      where: { conflictId: conflict.id },
    });
    await prisma.dailyCounterSnapshot.deleteMany({
      where: { conflictId: conflict.id },
    });

    await prisma.casualtyRecord.create({
      data: {
        conflictId: conflict.id,
        ...item.casualty,
      },
    });

    await prisma.source.create({
      data: {
        conflictId: conflict.id,
        ...item.source,
      },
    });

    await prisma.dailyCounterSnapshot.createMany({
      data: item.snapshots.map((snapshot) => ({
        conflictId: conflict.id,
        ...snapshot,
      })),
    });

    insertedCount += 1;
  }

  await prisma.siteSetting.upsert({
    where: { key: "site.disclaimer" },
    update: {
      value:
        "Starter records pair a broader all-deaths estimate with a narrower official or UN-linked count where available. Methodologies differ by conflict and should be reviewed before publication.",
    },
    create: {
      key: "site.disclaimer",
      value:
        "Starter records pair a broader all-deaths estimate with a narrower official or UN-linked count where available. Methodologies differ by conflict and should be reviewed before publication.",
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: "site.theme" },
    update: { value: "dark-newsroom" },
    create: {
      key: "site.theme",
      value: "dark-newsroom",
    },
  });

  return insertedCount;
}
