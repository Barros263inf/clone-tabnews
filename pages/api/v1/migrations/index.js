import { join } from "node:path";
import { runner } from "node-pg-migrate";
import database from "infra/database.js";

async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const migrationOptions = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    migrationsTable: "pgmigrations",
    dryRun: true,
    verbose: true,
    direction: "up",
  };

  if (request.method === "GET") {
    try {
      const pendingMigrations = await runner(migrationOptions);
      response.status(200).json(pendingMigrations);
    } catch (error) {
      response.status(200).end();
      console.log(error);
      throw error;
    } finally {
      await dbClient.end();
    }
  }

  if (request.method === "POST") {
    try {
      const migratedMigrations = await runner({
        ...migrationOptions,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations);
      }
      response.status(200).json(migratedMigrations);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      await dbClient.end();
    }
  }
}

export default migrations;
