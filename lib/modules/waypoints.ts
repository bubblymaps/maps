// Waypoints module
// Handles CRUD operations and queries related to waypoints
// Author: Linus K. CC BY-NC 4.0.

import { prisma } from "@/lib/prisma";

export interface WaypointData {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
    amenities?: string[];
    image?: string;
    maintainer?: string;
    addedByUserId: string;
    region?: string;
    verified?: boolean;
    approved?: boolean;
}

export interface WaypointUpdateData {
    name?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    amenities?: string[];
    image?: string;
    maintainer?: string;
    region?: string;
    verified?: boolean;
    approved?: boolean;
}

export class Waypoints {
    static async logChange(
        bubblerId: number,
        userId: string | null,
        action: "CREATE" | "UPDATE" | "DELETE",
        oldData?: any,
        newData?: any
    ) {
        return prisma.bubblerLog.create({
            data: {
                bubblerId,
                userId,
                action,
                oldData: oldData || null,
                newData: newData || null,
            },
        });
    }

    static async fetchLogs(bubblerId: number) {
        return prisma.bubblerLog.findMany({
            where: { bubblerId },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        handle: true,
                        displayName: true,
                        image: true,
                        verified: true,
                        moderator: true,
                    },
                },
            },
        });
    }

    static async get(id: number) {
        try {
            const bubbler = await prisma.bubbler.findUnique({
                where: { id },
                include: {
                    reviews: {
                        include: {
                            user: true,
                        },
                    },
                    addedBy: true,
                },
            });
            if (!bubbler) throw new Error("Bubbler not found");
            return bubbler;
        } catch (err: any) {
            throw new Error(err.message || "There was an issue fetching this bubbler");
        }
    }

    static async add(data: WaypointData) {
        const {
            name,
            latitude,
            longitude,
            description,
            amenities = [],
            image,
            maintainer,
            addedByUserId,
            region,
            verified = false,
            approved = false,
        } = data;

        const newBubbler = await prisma.bubbler.create({
            data: {
                name,
                latitude,
                longitude,
                description,
                amenities,
                image,
                maintainer,
                addedByUserId,
                region,
                verified,
                approved,
            },
        });

        await this.logChange(newBubbler.id, addedByUserId, "CREATE", null, newBubbler);

        return newBubbler;
    }

    static async delete(id: number, userId: string | null = null) {
        try {
            const oldBubbler = await this.get(id);
            const deletedBubbler = await prisma.bubbler.delete(
                {
                    where: { id },
                }
            );

            await this.logChange(id, userId ?? oldBubbler.addedByUserId, "DELETE", oldBubbler, null);

            return deletedBubbler;
        } catch (err: any) {
            throw new Error(err.message || "There was an issue deleting this waypoint");
        }
    }

    static async edit(id: number, data: WaypointUpdateData, userId: string | null = null) {
        const oldBubbler = await this.get(id);
        try {
            const updatedBubbler = await prisma.bubbler.update(
                {
                    where: { id },
                    data,
                }
            );
            
            await this.logChange(id, userId ?? oldBubbler.addedByUserId, "UPDATE", oldBubbler, updatedBubbler);

            return updatedBubbler;

        } catch (err: any) {
            throw new Error(err.message || "There was an issue updating this waypoint");
        }
    }

    static async approve(bubblerId: number) {
        try {
            return await prisma.bubbler.update({
                where: { id: bubblerId },
                data: { approved: true },
            });
        } catch (err: any) {
            throw new Error(err.message || "Could not approve bubbler");
        }
    }

    static async unapprove(bubblerId: number) {
        try {
            return await prisma.bubbler.update({
                where: { id: bubblerId },
                data: { approved: false },
            });
        } catch (err: any) {
            throw new Error(err.message || "Could not unapprove bubbler");
        }
    }

    static async verify(bubblerId: number) {
        try {
            return await prisma.bubbler.update({
                where: { id: bubblerId },
                data: { verified: true },
            });
        } catch (err: any) {
            throw new Error(err.message || "Could not verify bubbler");
        }
    }

    static async unverify(bubblerId: number) {
        try {
            return await prisma.bubbler.update({
                where: { id: bubblerId },
                data: { verified: false },
            });
        } catch (err: any) {
            throw new Error(err.message || "Could not unverify bubbler");
        }
    }

    static async bulkApprove(ids: number[]) {
        return prisma.bubbler.updateMany({
            where: { id: { in: ids } },
            data: { approved: true },
        });
    }

    static async bulkUnapprove(ids: number[]) {
        return prisma.bubbler.updateMany({
            where: { id: { in: ids } },
            data: { approved: false },
        });
    }

    static async bulkVerify(ids: number[]) {
        return prisma.bubbler.updateMany({
            where: { id: { in: ids } },
            data: { verified: true },
        });
    }

    static async bulkUnverify(ids: number[]) {
        return prisma.bubbler.updateMany({
            where: { id: { in: ids } },
            data: { verified: false },
        });
    }

    static async byId(id: number) {
        return prisma.bubbler.findUnique({
            where: { id },
            include: {
                addedBy: {
                    select: {
                        id: true,
                        handle: true,
                        displayName: true,
                        image: true,
                        verified: true,
                        moderator: true,
                    },
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                handle: true,
                                displayName: true,
                                image: true,
                                verified: true,
                                moderator: true,
                            },
                        },
                    },
                },
            },
        });
    }


    static async byUser(userId: string) {
        return prisma.bubbler.findMany({ where: { addedByUserId: userId } });
    }

    static async byRegion(region: string) {
        return prisma.bubbler.findMany({ where: { region } });
    }

    static async verified() {
        return prisma.bubbler.findMany({ where: { verified: true } });
    }

    static async unverified() {
        return prisma.bubbler.findMany({ where: { verified: false } });
    }

    static async approved() {
        return prisma.bubbler.findMany({ where: { approved: true } });
    }

    static async unapproved() {
        return prisma.bubbler.findMany({ where: { approved: false } });
    }

    static async pendingVerification() {
        return prisma.bubbler.findMany({ where: { verified: false }, orderBy: { createdAt: "desc" } });
    }

    static async pendingApproval() {
        return prisma.bubbler.findMany({ where: { approved: false }, orderBy: { createdAt: "desc" } });
    }

    static async all() {
        return prisma.bubbler.findMany({ orderBy: { createdAt: "desc" } });
    }

    static async search(query: string) {
        return prisma.bubbler.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { amenities: { has: query } },
                ],
            },
        });
    }

    static async byAmenity(amenity: string) {
        return prisma.bubbler.findMany({ where: { amenities: { has: amenity } } });
    }

    static async byMaintainer(maintainer: string) {
        return prisma.bubbler.findMany({ where: { maintainer } });
    }

    static async recent(limit: number = 10) {
        return prisma.bubbler.findMany({ orderBy: { createdAt: "desc" }, take: limit });
    }
}