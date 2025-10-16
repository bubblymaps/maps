/*
  Warnings:

  - A unique constraint covering the columns `[latitude]` on the table `Bubbler` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[longitude]` on the table `Bubbler` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bubbler_latitude_key" ON "public"."Bubbler"("latitude");

-- CreateIndex
CREATE UNIQUE INDEX "Bubbler_longitude_key" ON "public"."Bubbler"("longitude");
