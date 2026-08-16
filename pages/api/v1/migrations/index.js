import { join } from "node:path";
import { runner } from "node-pg-migrate";

async function migrations(request, response) {
  const migrationOptions = {
    databaseUrl: process.env.DATABASE_URL,
    dir: join("infra", "migrations"),
    migrationsTable: "pgmigrations",
    dryRun: true,
    verbose: true,
    direction: "up",
  };

  if (request.method === "GET") {
    const pendingMigrations = await runner(migrationOptions);

    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await runner({
      ...migrationOptions,
      dryRun: false,
    });

    response.status(200).json(migratedMigrations);
  }

  response.status(405).end();
}

export default migrations;
