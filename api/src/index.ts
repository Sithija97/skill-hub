import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "./db/data-source.js";
import { seed } from "./seed/seed.js";
import { config } from "./config.js";
import app from "./app.js";

AppDataSource.initialize()
  .then(async () => {
    console.log("[DB] Data source initialized");
    await seed();
    app.listen(config.port, () => {
      console.log(`[Server] Listening on http://localhost:${config.port}`);
    });
  })
  .catch((err: unknown) => {
    console.error("[DB] Failed to initialize data source:", err);
    process.exit(1);
  });
