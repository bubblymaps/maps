import { prisma } from "@/lib/prisma";
import { XP_REWARDS, XPAction, XP_REQUIRED } from "@/lib/xp-config";

/**
 * Award XP to a user for completing an action
 * @param userId - The user's ID
 * @param action - The action performed
 * @returns The updated user object with new XP total
 */
export async function awardXP(userId: string, action: XPAction) {
  if (!userId || userId === 'api') {
    // Don't award XP for API or invalid users
    console.log(`[XP] No XP awarded for userId: ${userId} due to API ID.`);
    return null;
  }

  const xpAmount = XP_REWARDS[action];
  
  if (!xpAmount) {
    console.warn(`[XP] Unknown action: ${action}`);
    return null;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: xpAmount,
        },
      },
      select: {
        id: true,
        xp: true,
        displayName: true,
        handle: true,
      },
    });

    console.log(`[XP] Awarded ${xpAmount} XP to user ${userId} for ${action}. New total: ${updatedUser.xp}`);
    
    return updatedUser;
  } catch (error) {
    console.error(`[XP] Failed to award XP to user ${userId}:`, error);
    return null;
  }
}

/**
 * Get a user's current XP
 * @param userId - The user's ID
 * @returns The user's XP amount
 */
export async function getUserXP(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });
    
    return user?.xp ?? 0;
  } catch (error) {
    console.error(`[XP] Failed to fetch XP for user ${userId}:`, error);
    return 0;
  }
}

/**
 * Check whether a user meets a specific XP requirement.
 * Returns `true` for API token use (`userId === 'api'`) or when the user has enough XP.
 */
export async function hasRequiredXP(userId: string | null | undefined, required: number): Promise<boolean> {
  if (!userId) return false;
  // API token or system user bypasses XP requirements
  if (userId === 'api') return true;

  const xp = await getUserXP(userId);
  return xp >= required;
}

export async function canCreateWaypoint(userId: string | null | undefined): Promise<boolean> {
  return hasRequiredXP(userId, XP_REQUIRED.CREATE_WAYPOINT);
}

export async function canEditWaypoint(userId: string | null | undefined): Promise<boolean> {
  return hasRequiredXP(userId, XP_REQUIRED.EDIT_WAYPOINT);
}

/**
 * Get XP leaderboard
 * @param limit - Number of top users to return
 * @returns Array of users sorted by XP
 */
export async function getXPLeaderboard(limit = 10) {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
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
    
    return topUsers;
  } catch (error) {
    console.error('[XP] Failed to fetch leaderboard:', error);
    return [];
  }
}
