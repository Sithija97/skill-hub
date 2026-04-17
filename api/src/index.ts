import "dotenv/config";
import { prisma } from "./db/prisma.js";
import { seed } from "./seed/seed.js";
import { config } from "./config.js";
import app from "./app.js";

async function bootstrap(): Promise<void> {
  await prisma.$connect();
  console.log("[DB] Prisma connected");
  await seed();
  app.listen(config.port, () => {
    console.log(`[Server] Listening on http://localhost:${config.port}`);
  });
}

bootstrap().catch((err: unknown) => {
  console.error("[Server] Failed to start:", err);
  process.exit(1);
});
