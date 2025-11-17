-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';
