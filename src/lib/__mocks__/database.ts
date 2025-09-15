import { PrismaClient } from "@prisma/client";
import { mockDeep } from "vitest-mock-extended";

const mockedPrisma = mockDeep<PrismaClient>();
export default mockedPrisma;
