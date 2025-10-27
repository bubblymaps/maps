-- CreateTable
CREATE TABLE "ReportAbuse" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetId" TEXT,
    "reason" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportAbuse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportAbuse_reporterId_idx" ON "ReportAbuse"("reporterId");

-- AddForeignKey
ALTER TABLE "ReportAbuse" ADD CONSTRAINT "ReportAbuse_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
