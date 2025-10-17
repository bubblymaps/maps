/*
  Warnings:

  - A unique constraint covering the columns `[latitude,longitude]` on the table `Bubbler` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Bubbler_latitude_key";

-- DropIndex
DROP INDEX "public"."Bubbler_longitude_key";

-- CreateIndex
CREATE UNIQUE INDEX "Bubbler_latitude_longitude_key" ON "public"."Bubbler"("latitude", "longitude");
