// -----------------------------------------------------------------------------
// Bubbly Maps user helpers
// -----------------------------------------------------------------------------
// This file contains helper functions for user management in Bubbly Maps.
// 
// Available functions:
// - getUserByUsername(handle)          : Get a user by handle (username)
// - getUserById(id)                    : Get a user by ID
// - searchUsers(query, limit)          : Search users by handle or displayName
// - getModerators()                    : Get all moderators
// - getRecentUsers(limit)              : Get recently joined users
// - updateUserXP(id, xpDelta)          : Increment a user's XP
// - adjustUserXP(id, xpDelta)          : Alias for updateUserXP
// - updateUserProfile(id, data)        : Update displayName, bio, or image
// - updateUserFullProfile(id, data)    : Update multiple fields including moderator, verified, xp
// - deleteUser(id)                     : Delete a user
// - createUser(data)                   : Create a new user
// - setModeratorStatus(id, isMod)      : Promote or demote a user
// - setVerifiedStatus(id, isVerified)  : Verify or unverify a user
// - getTopUsers(limit)                 : Get users ordered by XP
// - countUsers()                       : Total number of users
// - getUsersByDateRange(start, end)    : Users who joined between two dates
// -----------------------------------------------------------------------------

import { prisma } from "@/lib/prisma";

export async function getUserByUsername(handle: string) {
  return prisma.user.findUnique({
    where: { handle },
    select: {
      id: true,
      displayName: true,
      handle: true,
      bio: true,
      image: true,
      verified: true,
      moderator: true,
      xp: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      handle: true,
      bio: true,
      image: true,
      verified: true,
      moderator: true,
      xp: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function searchUsers(query: string, limit = 10) {
  return prisma.user.findMany({
    where: {
      OR: [
        { handle: { contains: query, mode: "insensitive" } },
        { displayName: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    orderBy: { xp: "desc" },
    select: {
      id: true,
      displayName: true,
      handle: true,
      image: true,
      verified: true,
    },
  });
}

export async function getModerators() {
  return prisma.user.findMany({
    where: { moderator: true },
    select: {
      id: true,
      displayName: true,
      handle: true,
      image: true,
      verified: true,
    },
  });
}

export async function getRecentUsers(limit = 10) {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      displayName: true,
      handle: true,
      image: true,
      createdAt: true,
    },
  });
}

export async function updateUserXP(id: string, xpDelta: number) {
  return prisma.user.update({
    where: { id },
    data: { xp: { increment: xpDelta } },
    select: { id: true, xp: true },
  });
}

export async function updateUserProfile(
  id: string,
  data: Partial<{ displayName: string; bio: string; image: string }>
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      displayName: true,
      bio: true,
      image: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
    select: { id: true, handle: true },
  });
}

export async function createUser(data: {
  handle: string;
  displayName?: string;
  bio?: string;
  image?: string;
  verified?: boolean;
  moderator?: boolean;
  xp?: number;
}) {
  return prisma.user.create({
    data: {
      handle: data.handle,
      displayName: data.displayName || data.handle,
      bio: data.bio || "",
      image: data.image || "",
      verified: data.verified || false,
      moderator: data.moderator || false,
      xp: data.xp || 0,
    },
    select: {
      id: true,
      handle: true,
      displayName: true,
      bio: true,
      image: true,
      verified: true,
      moderator: true,
      xp: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function adjustUserXP(id: string, xpDelta: number) {
  return prisma.user.update({
    where: { id },
    data: { xp: { increment: xpDelta } },
    select: { id: true, xp: true },
  });
}

export async function setModeratorStatus(id: string, isModerator: boolean) {
  return prisma.user.update({
    where: { id },
    data: { moderator: isModerator },
    select: { id: true, moderator: true },
  });
}

export async function setVerifiedStatus(id: string, isVerified: boolean) {
  return prisma.user.update({
    where: { id },
    data: { verified: isVerified },
    select: { id: true, verified: true },
  });
}

export async function getTopUsers(limit = 10) {
  return prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: limit,
    select: {
      id: true,
      displayName: true,
      handle: true,
      image: true,
      xp: true,
      verified: true,
    },
  });
}

export async function countUsers() {
  return prisma.user.count();
}

export async function getUsersByDateRange(startDate: Date, endDate: Date) {
  return prisma.user.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      handle: true,
      displayName: true,
      createdAt: true,
    },
  });
}

export async function updateUserFullProfile(
  id: string,
  data: Partial<{
    displayName: string;
    bio: string;
    image: string;
    verified: boolean;
    moderator: boolean;
    xp: number;
  }>
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      handle: true,
      displayName: true,
      bio: true,
      image: true,
      verified: true,
      moderator: true,
      xp: true,
      updatedAt: true,
    },
  });
}