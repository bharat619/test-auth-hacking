import { clearAllRecords } from "../lib/db";

async function main() {
  if (process.env.VERCEL !== "1") {
    console.log("Skipping database clear (not a Vercel deployment build).");
    return;
  }

  console.log("Clearing database records for Vercel deployment...");
  await clearAllRecords();
  console.log("Database records cleared.");
}

main().catch((error) => {
  console.error("Database clear failed:", error);
  process.exit(1);
});
