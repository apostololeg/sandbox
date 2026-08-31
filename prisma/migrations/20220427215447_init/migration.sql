/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('EN', 'UA', 'RU');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "PostTexts" (
    "id" SERIAL NOT NULL,
    "lang" "Lang" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "PostTexts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostTexts" ADD CONSTRAINT "PostTexts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
