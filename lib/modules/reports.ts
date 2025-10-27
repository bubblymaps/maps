import { prisma } from "../prisma";

export interface ReportAbuseData {
  type: string;
  reporterId: string;
  targetId: string;
  reason: string;
}

export class ReportAbuse {
  static async create(data: ReportAbuseData) {
    try {
      const newReport = await prisma.reportAbuse.create({
        data,
      });
      return newReport;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue creating the abuse report");
    }
  }

  static async resolve(id: number) {
    try {
      const resolvedReport = await prisma.reportAbuse.update({
        where: { id },
        data: { resolved: true },
      });
      return resolvedReport;
    } catch (err: any) {
      throw new Error(err.message || "There was an issue resolving the abuse report");
    }
  }

  static async unresolved() {
    try {
      return await prisma.reportAbuse.findMany({
        where: { resolved: false },
        orderBy: { createdAt: "desc" },
      });
    } catch (err: any) {
      throw new Error(err.message || "There was an issue fetching abuse reports");
    }
  }
}
