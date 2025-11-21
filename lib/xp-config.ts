/**
 * XP Configuration
 * Define the amount of XP awarded for each user action
 */

export const XP_REWARDS = {
  // Waypoint actions
  CREATE_WAYPOINT: 30,
  EDIT_WAYPOINT: 15,
  
  // Review actions
  ADD_REVIEW: 10,
  
  // Future actions (can be extended)
  // VERIFY_WAYPOINT: 100,
  // REPORT_ISSUE: 10,
  // PHOTO_UPLOAD: 20,
} as const;

export type XPAction = keyof typeof XP_REWARDS;

/**
 * Minimum required XP to perform certain actions. Set sensible defaults here.
 * Site owners can increase these values to restrict actions to more-experienced users.
 */
export const XP_REQUIRED = {
  // Minimum XP required to create a waypoint. Default 0 (no restriction).
  CREATE_WAYPOINT: 750,
  // Minimum XP required to edit an existing waypoint. Default 0 (no restriction).
  EDIT_WAYPOINT: 250,
} as const;

export type XPRequirement = keyof typeof XP_REQUIRED;
