export function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    "postgresql://postgres:dbgfpDSadkCiAYceFTQgwKHRUFhrLhff@postgres.railway.internal:5432/railway"
  );
}
