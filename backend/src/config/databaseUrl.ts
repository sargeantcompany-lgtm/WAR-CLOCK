export function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? "postgresql://war_clock:war_clock@localhost:5432/war_clock";
}
