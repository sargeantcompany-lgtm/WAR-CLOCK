import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "../src/config/databaseUrl";

const prisma = new PrismaClient({
  datasourceUrl: getDatabaseUrl(),
});

type ConflictStatusValue = "ACTIVE" | "PAUSED" | "ENDED";
type SourceTypeValue =
  | "UN"
  | "NGO"
  | "GOVERNMENT"
  | "MEDIA"
  | "ACADEMIC"
  | "OTHER";

type SampleConflict = {
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
    killedMin: number;
    killedMax: number;
    killedBest: number;
    injuredMin: number;
    injuredMax: number;
    injuredBest: number;
    civilianKilledMin: number;
    civilianKilledMax: number;
    civilianKilledBest: number;
    childKilledMin: number;
    childKilledMax: number;
    childKilledBest: number;
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
    displayedInjuredTotal: number;
    dailyIncreaseKilled: number;
    dailyIncreaseInjured: number;
    smoothingHours: number;
  }>;
};

const sampleConflicts: SampleConflict[] = [
  {
    slug: "gaza-demo",
    name: "Gaza Conflict Tracker Demo",
    shortName: "Gaza Demo",
    description:
      "Sample placeholder dataset for UI development. Values are demo-only and must not be treated as factual reporting.",
    region: "Middle East",
    status: "ACTIVE",
    startDate: new Date("2023-10-07"),
    mainCountriesJson: JSON.stringify(["Palestine", "Israel"]),
    sideAJson: JSON.stringify(["Hamas", "Allied armed groups"]),
    sideBJson: JSON.stringify(["Israel"]),
    tagsJson: JSON.stringify(["sample", "demo", "middle-east"]),
    heroLabel: "Sample data only",
    priority: 100,
    featured: true,
    casualty: {
      recordDate: new Date("2026-03-15"),
      killedMin: 49800,
      killedMax: 50300,
      killedBest: 50050,
      injuredMin: 111000,
      injuredMax: 112400,
      injuredBest: 111700,
      civilianKilledMin: 34000,
      civilianKilledMax: 35000,
      civilianKilledBest: 34500,
      childKilledMin: 14500,
      childKilledMax: 15000,
      childKilledBest: 14750,
      notes: "Demo placeholder record for development only.",
      sourceSummary: "Sample synthesis of public reporting for demo use only.",
    },
    source: {
      sourceType: "UN",
      title: "Sample UN-style update for development",
      publisher: "Demo Data Publisher",
      url: "https://example.com/demo/gaza-update",
      publishedAt: new Date("2026-03-15"),
      accessedAt: new Date("2026-03-18"),
      reliabilityScore: 4,
      notes: "Placeholder citation for development only.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-03-14"),
        displayedKilledTotal: 49940,
        displayedInjuredTotal: 111550,
        dailyIncreaseKilled: 90,
        dailyIncreaseInjured: 150,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-03-15"),
        displayedKilledTotal: 50050,
        displayedInjuredTotal: 111700,
        dailyIncreaseKilled: 110,
        dailyIncreaseInjured: 150,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "ukraine-demo",
    name: "Ukraine Conflict Tracker Demo",
    shortName: "Ukraine Demo",
    description:
      "Sample placeholder dataset for development and layout testing. This seed demonstrates a documented update with no new increase between the last two snapshots.",
    region: "Eastern Europe",
    status: "ACTIVE",
    startDate: new Date("2022-02-24"),
    mainCountriesJson: JSON.stringify(["Ukraine", "Russia"]),
    sideAJson: JSON.stringify(["Ukraine"]),
    sideBJson: JSON.stringify(["Russia"]),
    tagsJson: JSON.stringify(["sample", "demo", "europe"]),
    heroLabel: "Development sample",
    priority: 95,
    featured: true,
    casualty: {
      recordDate: new Date("2026-03-13"),
      killedMin: 12500,
      killedMax: 13100,
      killedBest: 12820,
      injuredMin: 24500,
      injuredMax: 25200,
      injuredBest: 24850,
      civilianKilledMin: 11800,
      civilianKilledMax: 12300,
      civilianKilledBest: 12090,
      childKilledMin: 620,
      childKilledMax: 700,
      childKilledBest: 660,
      notes: "Demo-only placeholder figure.",
      sourceSummary: "Sample aggregation from placeholder reporting.",
    },
    source: {
      sourceType: "NGO",
      title: "Sample NGO briefing for development",
      publisher: "Demo Monitoring Group",
      url: "https://example.com/demo/ukraine-briefing",
      publishedAt: new Date("2026-03-13"),
      accessedAt: new Date("2026-03-18"),
      reliabilityScore: 4,
      notes: "Development placeholder only.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-03-12"),
        displayedKilledTotal: 12820,
        displayedInjuredTotal: 24850,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-03-13"),
        displayedKilledTotal: 12820,
        displayedInjuredTotal: 24850,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 0,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "sudan-demo",
    name: "Sudan Conflict Tracker Demo",
    shortName: "Sudan Demo",
    description:
      "Sample placeholder casualty and counter data for backend testing. Not verified factual data.",
    region: "North Africa",
    status: "ACTIVE",
    startDate: new Date("2023-04-15"),
    mainCountriesJson: JSON.stringify(["Sudan"]),
    sideAJson: JSON.stringify(["Sudanese Armed Forces"]),
    sideBJson: JSON.stringify(["Rapid Support Forces"]),
    tagsJson: JSON.stringify(["sample", "demo", "africa"]),
    heroLabel: "Demo feed",
    priority: 90,
    featured: false,
    casualty: {
      recordDate: new Date("2026-03-12"),
      killedMin: 21800,
      killedMax: 22400,
      killedBest: 22110,
      injuredMin: 32100,
      injuredMax: 32900,
      injuredBest: 32520,
      civilianKilledMin: 15800,
      civilianKilledMax: 16300,
      civilianKilledBest: 16050,
      childKilledMin: 920,
      childKilledMax: 1020,
      childKilledBest: 970,
      notes: "Sample values only.",
      sourceSummary: "Placeholder summary for development.",
    },
    source: {
      sourceType: "MEDIA",
      title: "Sample media roundup for development",
      publisher: "Demo Newsroom",
      url: "https://example.com/demo/sudan-roundup",
      publishedAt: new Date("2026-03-12"),
      accessedAt: new Date("2026-03-18"),
      reliabilityScore: 3,
      notes: "For development only.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-03-11"),
        displayedKilledTotal: 22020,
        displayedInjuredTotal: 32460,
        dailyIncreaseKilled: 55,
        dailyIncreaseInjured: 75,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-03-12"),
        displayedKilledTotal: 22110,
        displayedInjuredTotal: 32520,
        dailyIncreaseKilled: 90,
        dailyIncreaseInjured: 60,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "myanmar-demo",
    name: "Myanmar Conflict Tracker Demo",
    shortName: "Myanmar Demo",
    description:
      "Placeholder data set for interface and integration testing. This seed demonstrates a revision case where the latest documented total is lower than the previous displayed total.",
    region: "Southeast Asia",
    status: "ACTIVE",
    startDate: new Date("2021-02-01"),
    mainCountriesJson: JSON.stringify(["Myanmar"]),
    sideAJson: JSON.stringify(["Myanmar military"]),
    sideBJson: JSON.stringify(["Opposition forces", "Ethnic armed groups"]),
    tagsJson: JSON.stringify(["sample", "demo", "asia"]),
    heroLabel: "Sample record",
    priority: 80,
    featured: false,
    casualty: {
      recordDate: new Date("2026-03-10"),
      killedMin: 6760,
      killedMax: 7060,
      killedBest: 6980,
      injuredMin: 11200,
      injuredMax: 11800,
      injuredBest: 11540,
      civilianKilledMin: 4100,
      civilianKilledMax: 4480,
      civilianKilledBest: 4290,
      childKilledMin: 380,
      childKilledMax: 450,
      childKilledBest: 412,
      notes: "Sample placeholder only.",
      sourceSummary: "Illustrative development summary.",
    },
    source: {
      sourceType: "OTHER",
      title: "Sample civil society note for development",
      publisher: "Demo Civil Society Archive",
      url: "https://example.com/demo/myanmar-note",
      publishedAt: new Date("2026-03-10"),
      accessedAt: new Date("2026-03-18"),
      reliabilityScore: 3,
      notes: "Development-only sample source.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-03-09"),
        displayedKilledTotal: 7010,
        displayedInjuredTotal: 11490,
        dailyIncreaseKilled: 45,
        dailyIncreaseInjured: 35,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-03-10"),
        displayedKilledTotal: 6980,
        displayedInjuredTotal: 11540,
        dailyIncreaseKilled: 0,
        dailyIncreaseInjured: 50,
        smoothingHours: 24,
      },
    ],
  },
  {
    slug: "yemen-demo",
    name: "Yemen Conflict Tracker Demo",
    shortName: "Yemen Demo",
    description:
      "Sample placeholder data for the WAR CLOCK backend seed. Not factual and not for publication.",
    region: "Arabian Peninsula",
    status: "PAUSED",
    startDate: new Date("2014-09-01"),
    mainCountriesJson: JSON.stringify(["Yemen"]),
    sideAJson: JSON.stringify(["Houthis"]),
    sideBJson: JSON.stringify(["Government-aligned forces"]),
    tagsJson: JSON.stringify(["sample", "demo", "paused"]),
    heroLabel: "Archive sample",
    priority: 60,
    featured: false,
    casualty: {
      recordDate: new Date("2026-03-08"),
      killedMin: 15100,
      killedMax: 15700,
      killedBest: 15410,
      injuredMin: 21900,
      injuredMax: 22600,
      injuredBest: 22320,
      civilianKilledMin: 9200,
      civilianKilledMax: 9700,
      civilianKilledBest: 9450,
      childKilledMin: 1450,
      childKilledMax: 1550,
      childKilledBest: 1490,
      notes: "Demo archive entry only.",
      sourceSummary: "Placeholder archive-style summary.",
    },
    source: {
      sourceType: "ACADEMIC",
      title: "Sample academic review for development",
      publisher: "Demo Conflict Research Lab",
      url: "https://example.com/demo/yemen-review",
      publishedAt: new Date("2026-03-08"),
      accessedAt: new Date("2026-03-18"),
      reliabilityScore: 4,
      notes: "Placeholder only.",
    },
    snapshots: [
      {
        snapshotDate: new Date("2026-03-07"),
        displayedKilledTotal: 15380,
        displayedInjuredTotal: 22280,
        dailyIncreaseKilled: 15,
        dailyIncreaseInjured: 20,
        smoothingHours: 24,
      },
      {
        snapshotDate: new Date("2026-03-08"),
        displayedKilledTotal: 15410,
        displayedInjuredTotal: 22320,
        dailyIncreaseKilled: 30,
        dailyIncreaseInjured: 40,
        smoothingHours: 24,
      },
    ],
  },
];

async function main() {
  await prisma.dailyCounterSnapshot.deleteMany();
  await prisma.source.deleteMany();
  await prisma.casualtyRecord.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.conflict.deleteMany();

  for (const item of sampleConflicts) {
    const conflict = await prisma.conflict.create({
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
  }

  await prisma.siteSetting.createMany({
    data: [
      {
        key: "site.disclaimer",
        value:
          "All bundled records are demo sample placeholders for development only and must not be treated as factual reporting.",
      },
      {
        key: "site.theme",
        value: "dark-newsroom",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
