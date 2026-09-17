import { join } from "node:path";
import { runner } from "node-pg-migrate";
import database from "infra/database.js";

async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({ error: `Method ${request.method} not allowed!` });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migrationOptions = {
      dbClient: dbClient,
      dir: join("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun: true,
      verbose: true,
      direction: "up",
    };

    if (request.method === "GET") {
      const pendingMigrations = await runner(migrationOptions);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await runner({
        ...migrationOptions,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

export default migrations;
