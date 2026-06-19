import { config } from "dotenv";
import { ensureSchema } from "../lib/db";

config({ path: ".env.local" });

async function main() {
  await ensureSchema();
  console.log("Database schema is ready.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
