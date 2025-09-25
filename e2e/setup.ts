import { spawn } from "child_process";

import { execCommand } from "@/utils/execCommand";

import { createDbBranch } from "./utils/dbBranch";

export default async function setupDb() {
  const dbBranch = await createDbBranch();
  process.env.DATABASE_URL = dbBranch.connection_uris[0].connection_uri;
  process.env.DATABASE_ID = dbBranch.branch.id;

  await execCommand(
    "pnpm",
    ["prisma", "migrate", "deploy"],
    "Running Migrations",
  );
  await execCommand("tsx", ["prisma/seed.ts"], "Creating Seed Data");

  process.env.NEXTJS_PROCESS_ID = spawn("pnpm", ["dev", "-p", "3100"], {
    stdio: "inherit",
  }).pid?.toString();

  await waitForServer("http://localhost:3100");
}

async function waitForServer(url: string): Promise<void> {
  for (let i = 0; i < 30; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // ignore
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("Server failed to start");
}
