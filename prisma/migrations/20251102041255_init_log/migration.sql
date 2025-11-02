-- CreateTable
CREATE TABLE "BubblerLog" (
    "id" SERIAL NOT NULL,
    "bubblerId" INTEGER NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BubblerLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BubblerLog_bubblerId_idx" ON "BubblerLog"("bubblerId");

-- CreateIndex
CREATE INDEX "BubblerLog_userId_idx" ON "BubblerLog"("userId");

-- AddForeignKey
ALTER TABLE "BubblerLog" ADD CONSTRAINT "BubblerLog_bubblerId_fkey" FOREIGN KEY ("bubblerId") REFERENCES "Bubbler"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BubblerLog" ADD CONSTRAINT "BubblerLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
