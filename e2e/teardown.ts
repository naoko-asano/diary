import { deleteDbBranch } from "./utils/dbBranch";

export default async function teardownDb() {
  process.kill(parseInt(process.env.NEXTJS_PROCESS_ID || ""));
  await deleteDbBranch(process.env.DATABASE_ID || "");
}
