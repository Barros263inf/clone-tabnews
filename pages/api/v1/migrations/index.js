import { join } from "node:path";
import { runner } from "node-pg-migrate";

async function migrations(request, response) {
  if (request.method === "GET") {
    const migrations = await runner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun: true,
      verbose: true,
      direction: "up",
    });

    response.status(200).json(migrations);
  }

  if (request.method === "POST") {
    const migrations = await runner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun: false,
      verbose: true,
      direction: "up",
    });

    response.status(200).json(migrations);
  }
  response.status(405).end();
}

export default migrations;
