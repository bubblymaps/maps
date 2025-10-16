/*
  Warnings:

  - A unique constraint covering the columns `[bubblerId,userId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_bubblerId_userId_key" ON "public"."Review"("bubblerId", "userId");
