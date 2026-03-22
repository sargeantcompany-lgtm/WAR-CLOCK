import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "../src/config/databaseUrl";
import { seedBootstrapData } from "../src/lib/bootstrapSeed";

const prisma = new PrismaClient({
  datasourceUrl: getDatabaseUrl(),
});

async function main() {
  await prisma.dailyCounterSnapshot.deleteMany();
  await prisma.source.deleteMany();
  await prisma.casualtyRecord.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.conflict.deleteMany();

  await seedBootstrapData(prisma);
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
