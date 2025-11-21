# XP System Documentation

## Overview
The XP (Experience Points) system rewards users for contributing to the platform. Users earn XP by performing various actions such as creating waypoints, editing them, and adding reviews.

## XP Rewards

The XP rewards for each action are defined in `lib/xp-config.ts`:

| Action | XP Awarded | Description |
|--------|-----------|-------------|
| `CREATE_WAYPOINT` | 50 XP | Creating a new waypoint/bubbler |
| `EDIT_WAYPOINT` | 15 XP | Editing an existing waypoint |
| `ADD_REVIEW` | 25 XP | Adding a review to a waypoint |

### Future Actions (Commented Out)
These can be enabled in the future:
- `VERIFY_WAYPOINT`: 100 XP - For verifying a waypoint
- `REPORT_ISSUE`: 10 XP - For reporting an issue
- `PHOTO_UPLOAD`: 20 XP - For uploading a photo

## Implementation

### Core Files

1. **`lib/xp-config.ts`** - XP reward configuration
   - Define XP amounts for each action
   - Easy to modify rewards without touching business logic

2. **`lib/xp.ts`** - XP utility functions
   - `awardXP(userId, action)` - Award XP to a user
   - `getUserXP(userId)` - Get a user's current XP
   - `getXPLeaderboard(limit)` - Get top users by XP

3. **API Integration**
   - `app/api/reviews/route.ts` - Awards XP on review creation
   - `app/api/waypoints/route.ts` - Awards XP on waypoint creation
   - `app/api/waypoints/[id]/route.ts` - Awards XP on waypoint edit
   - `app/api/xp/route.ts` - XP query endpoint

### Database Schema

The User model already includes the `xp` field:
```prisma
model User {
  // ... other fields
  xp Int @default(0)
  // ... other fields
}
```

## API Endpoints

### Get Current User's XP
```
GET /api/xp
```
Returns the authenticated user's XP.

**Response:**
```json
{
  "userId": "user_id",
  "xp": 150
}
```

### Get Specific User's XP
```
GET /api/xp?userId=user_id
```
Returns a specific user's XP.

### Get XP Leaderboard
```
GET /api/xp?action=leaderboard&limit=10
```
Returns the top users by XP.

**Response:**
```json
{
  "leaderboard": [
    {
      "id": "user_id",
      "displayName": "John Doe",
      "handle": "johndoe",
      "image": "profile.jpg",
      "xp": 500,
      "verified": true
    }
  ]
}
```

## Usage Examples

### Award XP in API Routes
```typescript
import { awardXP } from "@/lib/xp";

// After a successful action
await awardXP(userId, 'CREATE_WAYPOINT');
```

### Get User XP
```typescript
import { getUserXP } from "@/lib/xp";

const xp = await getUserXP(userId);
console.log(`User has ${xp} XP`);
```

### Get Leaderboard
```typescript
import { getXPLeaderboard } from "@/lib/xp";

const topUsers = await getXPLeaderboard(10);
```

## Modifying XP Rewards

To change XP rewards, edit `lib/xp-config.ts`:

```typescript
export const XP_REWARDS = {
  CREATE_WAYPOINT: 100, // Changed from 50 to 100
  EDIT_WAYPOINT: 20,    // Changed from 15 to 20
  ADD_REVIEW: 30,       // Changed from 25 to 30
} as const;
```

## Adding New XP Actions

1. Add the action to `lib/xp-config.ts`:
```typescript
export const XP_REWARDS = {
  // ... existing actions
  NEW_ACTION: 40,
} as const;
```

2. Call `awardXP` in the appropriate API route:
```typescript
await awardXP(userId, 'NEW_ACTION');
```

## Notes

- XP is not awarded to API token users (userId === 'api')
- XP changes are logged to the console for monitoring
- Failed XP awards don't block the main action (gracefully handled)
- All XP operations are database transactions for consistency
