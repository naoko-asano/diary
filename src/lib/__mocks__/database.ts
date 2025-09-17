import { mockDeep } from "vitest-mock-extended";

import { PrismaClient } from "@/generated/prisma";

const mockedPrisma = mockDeep<PrismaClient>();
export default mockedPrisma;
