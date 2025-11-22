# Bubbly Maps API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Common Headers](#common-headers)
- [Error Responses](#error-responses)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Waypoints](#waypoints-endpoints)
  - [Reviews](#reviews-endpoints)
  - [Users](#users-endpoints)
  - [XP System](#xp-system-endpoints)
  - [Stats](#stats-endpoints)
  - [Upload](#upload-endpoints)
  - [Reports](#reports-endpoints)
  - [Moderator](#moderator-endpoints)

---

## Overview

Bubbly Maps API provides RESTful endpoints for managing water fountain locations (waypoints), user reviews, user profiles, and more. The API supports both session-based authentication (via NextAuth) and API token authentication for programmatic access.

---

## Authentication

The API supports two authentication methods:

### 1. Session-Based Authentication (NextAuth)
Users authenticate via Google OAuth through NextAuth. Once authenticated, a session cookie is automatically included in requests.

**Login URL:** `/api/auth/signin`

### 2. API Token Authentication
For programmatic access, use an API token in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer YOUR_API_TOKEN
```

**Environment Variables:**
- `API_TOKEN` (preferred) or `API_KEY` (legacy support)

**Notes:**
- API token authentication bypasses session requirements
- API tokens have elevated privileges similar to moderators
- API tokens can set admin-only fields like `approved`, `verified`, and `addedByUserId`

---

## Base URL

**Production:** `https://bubblymaps.org/api`
**Development:** `http://localhost:3000/api`

---

## Common Headers

### Required for Authenticated Requests:
```
Content-Type: application/json
```

### Optional (for API Token):
```
Authorization: Bearer YOUR_API_TOKEN
```

### Session Cookie (Automatic):
Session cookies are automatically sent by the browser after authentication via NextAuth.

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Endpoints

---

## Authentication Endpoints

### NextAuth Authentication

#### Sign In
```
GET /api/auth/signin
```
Redirects to Google OAuth sign-in page.

#### Sign Out
```
GET /api/auth/signout
```
Signs out the current user and clears the session.

#### Session
```
GET /api/auth/session
```
Returns the current user's session information.

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "profile_image_url",
    "handle": "johndoe",
    "displayName": "John Doe",
    "bio": "User bio",
    "moderator": false
  },
  "expires": "2024-12-31T23:59:59.999Z"
}
```

---

## Waypoints Endpoints

Waypoints represent water fountain locations (also called "bubblers").

### Get All Waypoints

```
GET /api/waypoints
```

Returns all waypoints ordered by creation date (newest first).

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | No | Filter waypoints by user ID |
| `q` | string | No | Search query for name, description, or amenities |

**Examples:**
```bash
# Get all waypoints
GET /api/waypoints

# Get waypoints by specific user
GET /api/waypoints?userId=linuskang

# Search waypoints
GET /api/waypoints?q=park
```

**Response (All Waypoints):**
```json
[
  {
    "id": 1,
    "name": "Central Park Fountain",
    "latitude": 40.785091,
    "longitude": -73.968285,
    "description": "Public drinking fountain near the main entrance",
    "amenities": ["accessible", "cold_water"],
    "image": "https://example.com/image.jpg",
    "maintainer": "NYC Parks Department",
    "region": "New York, NY",
    "verified": true,
    "approved": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "addedByUserId": "user_id",
    "addedBy": {
      "id": "user_id",
      "image": "profile_url",
      "displayName": "John Doe",
      "handle": "johndoe"
    },
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Great water fountain!",
        "userId": "user_id",
        "bubblerId": 1,
        "createdAt": "2024-01-16T12:00:00.000Z",
        "user": {
          "handle": "johndoe"
        }
      }
    ]
  }
]
```

**Response (Search):**
```json
[
  {
    "id": 1,
    "name": "Central Park Fountain",
    "latitude": 40.785091,
    "longitude": -73.968285,
    "verified": true,
    "approved": true
  }
]
```

---

### Get Recent Waypoints

```
GET /api/waypoints/recent
```

Returns the most recently added waypoints.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 10 | Number of waypoints to return (max 100) |

**Example:**
```bash
GET /api/waypoints/recent?limit=20
```

**Response:**
```json
{
  "waypoints": [
    {
      "id": 1,
      "name": "Central Park Fountain",
      "latitude": 40.785091,
      "longitude": -73.968285,
      "description": "Public drinking fountain",
      "verified": true,
      "approved": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Create Waypoint

```
POST /api/waypoints
```

Creates a new waypoint/water fountain location.

**Authentication:** Required (Session or API Token)

**XP Requirement:** User must have at least 750 XP to create a waypoint (does not apply to API tokens or moderators)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN (optional, if using API token)
```

**Request Body:**
```json
{
  "name": "Central Park Fountain",
  "latitude": 40.785091,
  "longitude": -73.968285,
  "description": "Public drinking fountain near the main entrance",
  "amenities": ["accessible", "cold_water"],
  "image": "https://example.com/image.jpg",
  "maintainer": "NYC Parks Department",
  "region": "New York, NY"
}
```

**Required Fields:**
- `name` (string)
- `latitude` (number)
- `longitude` (number)
- `addedByUserId` (string) - Automatically set from session, or must be provided with API token

**Optional Fields:**
- `description` (string)
- `amenities` (array of strings)
- `image` (string - URL)
- `maintainer` (string)
- `region` (string)

**Admin-Only Fields (API Token or Moderator):**
- `approved` (boolean)
- `verified` (boolean)
- `addedByUserId` (string) - Can be overridden by API token

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Central Park Fountain",
  "latitude": 40.785091,
  "longitude": -73.968285,
  "description": "Public drinking fountain near the main entrance",
  "amenities": ["accessible", "cold_water"],
  "image": "https://example.com/image.jpg",
  "maintainer": "NYC Parks Department",
  "region": "New York, NY",
  "verified": false,
  "approved": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "addedByUserId": "user_id"
}
```

**XP Award:** 30 XP awarded upon successful creation (for authenticated users only)

**Error Responses:**
- `401 Unauthorized` - Missing valid session or API token
- `403 Forbidden` - Insufficient XP (less than 750 XP required)
- `400 Bad Request` - Missing required fields

---

### Get Waypoint by ID

```
GET /api/waypoints/{id}
```

Returns detailed information about a specific waypoint including its edit history logs.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Waypoint ID |

**Example:**
```bash
GET /api/waypoints/123
```

**Response:**
```json
{
  "waypoint": {
    "id": 123,
    "name": "Central Park Fountain",
    "latitude": 40.785091,
    "longitude": -73.968285,
    "description": "Public drinking fountain",
    "amenities": ["accessible", "cold_water"],
    "image": "https://example.com/image.jpg",
    "maintainer": "NYC Parks Department",
    "region": "New York, NY",
    "verified": true,
    "approved": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:00:00.000Z",
    "addedByUserId": "user_id"
  },
  "logs": [
    {
      "id": 1,
      "action": "CREATE",
      "userId": "user_id",
      "changes": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "action": "UPDATE",
      "userId": "another_user_id",
      "changes": {
        "description": {
          "old": "Old description",
          "new": "Public drinking fountain"
        }
      },
      "createdAt": "2024-01-20T14:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Waypoint does not exist
- `400 Bad Request` - Invalid waypoint ID

---

### Update Waypoint

```
PATCH /api/waypoints/{id}
```

Updates an existing waypoint.

**Authentication:** Required (Session or API Token)

**XP Requirement:** User must have at least 250 XP to edit a waypoint (does not apply to API tokens or moderators)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Waypoint ID |

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN (optional, if using API token)
```

**Request Body (all fields optional):**
```json
{
  "name": "Updated Fountain Name",
  "latitude": 40.785091,
  "longitude": -73.968285,
  "description": "Updated description",
  "amenities": ["accessible", "cold_water", "bottle_filler"],
  "image": "https://example.com/new-image.jpg",
  "maintainer": "Updated Maintainer",
  "region": "New York, NY"
}
```

**Allowed Fields:**
- `name` (string)
- `latitude` (number)
- `longitude` (number)
- `description` (string)
- `amenities` (array of strings)
- `image` (string)
- `maintainer` (string)
- `region` (string)

**Admin-Only Fields (API Token or Moderator):**
- `approved` (boolean)
- `verified` (boolean)
- `addedByUserId` (string)

**Response:**
```json
{
  "id": 123,
  "name": "Updated Fountain Name",
  "latitude": 40.785091,
  "longitude": -73.968285,
  "description": "Updated description",
  "amenities": ["accessible", "cold_water", "bottle_filler"],
  "verified": true,
  "approved": true,
  "updatedAt": "2024-01-20T14:00:00.000Z"
}
```

**XP Award:** 15 XP awarded upon successful edit (for authenticated users only)

**Error Responses:**
- `401 Unauthorized` - Missing valid session or API token
- `403 Forbidden` - Insufficient XP (less than 250 XP required)
- `400 Bad Request` - Invalid waypoint ID or data

---

### Delete Waypoint

```
DELETE /api/waypoints/{id}
```

Deletes a waypoint. Only moderators or API token holders can delete waypoints.

**Authentication:** Required (Moderator session or API Token)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Waypoint ID |

**Headers:**
```
Authorization: Bearer YOUR_API_TOKEN (if using API token)
```

**Example:**
```bash
DELETE /api/waypoints/123
Authorization: Bearer YOUR_API_TOKEN
```

**Response:**
```json
{
  "id": 123,
  "name": "Central Park Fountain",
  "deleted": true
}
```

**Error Responses:**
- `401 Unauthorized` - Missing valid API token or moderator session
- `400 Bad Request` - Invalid waypoint ID

---

## Reviews Endpoints

Reviews allow users to rate and comment on waypoints.

### Get Reviews

```
GET /api/reviews
```

Returns reviews based on query parameters.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | No | Filter reviews by user ID |
| `bubblerId` | number | No | Filter reviews by waypoint/bubbler ID |

**Examples:**
```bash
# Get all reviews
GET /api/reviews

# Get reviews by user
GET /api/reviews?userId=user123

# Get reviews for a specific waypoint
GET /api/reviews?bubblerId=456
```

**Response:**
```json
{
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great water fountain! Cold and clean.",
      "userId": "user_id",
      "bubblerId": 123,
      "createdAt": "2024-01-16T12:00:00.000Z",
      "user": {
        "id": "user_id",
        "handle": "johndoe",
        "displayName": "John Doe"
      },
      "bubbler": {
        "id": 123,
        "name": "Central Park Fountain"
      }
    }
  ]
}
```

---

### Create Review

```
POST /api/reviews
```

Adds a review to a waypoint.

**Authentication:** Required (Session)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "bubblerId": 123,
  "rating": 5,
  "comment": "Great water fountain! Cold and clean."
}
```

**Required Fields:**
- `bubblerId` (number)
- `rating` (number, 1-5)

**Optional Fields:**
- `comment` (string)

**Response (201 Created):**
```json
{
  "review": {
    "id": 1,
    "rating": 5,
    "comment": "Great water fountain! Cold and clean.",
    "userId": "user_id",
    "bubblerId": 123,
    "createdAt": "2024-01-16T12:00:00.000Z"
  }
}
```

**XP Award:** 10 XP awarded upon successful review creation

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - Missing bubblerId or rating

---

### Delete Review

```
DELETE /api/reviews?id={reviewId}
```

Deletes a review. Users can delete their own reviews, moderators can delete any review, and API token holders can delete any review.

**Authentication:** Required (Session or API Token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Review ID |

**Headers (if using API token):**
```
Authorization: Bearer YOUR_API_TOKEN
```

**Example:**
```bash
DELETE /api/reviews?id=123
```

**Response:**
```json
{
  "review": {
    "id": 123,
    "rating": 5,
    "comment": "Great water fountain!",
    "deleted": true
  }
}
```

**Authorization Rules:**
- Users can delete their own reviews
- Moderators can delete any review
- API token holders can delete any review

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - User is not the review owner and not a moderator
- `404 Not Found` - Review does not exist
- `400 Bad Request` - Missing review ID

---

## Users Endpoints

Manage user profiles and information.

### Get All Users

```
GET /api/users
```

Returns a list of all users with email fields redacted for privacy.

**Response:**
```json
[
  {
    "id": "user_id",
    "handle": "johndoe",
    "displayName": "John Doe",
    "bio": "Water fountain enthusiast",
    "image": "profile_image_url",
    "xp": 150,
    "moderator": false,
    "verified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "email": 0,
    "emailVerified": 0
  }
]
```

**Note:** Email fields are intentionally set to `0` for privacy.

---

### Get User by Handle

```
GET /api/users/{handle}
```

Returns a specific user's profile by their handle (username).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `handle` | string | Yes | User's handle/username |

**Example:**
```bash
GET /api/users/johndoe
```

**Response:**
```json
{
  "id": "user_id",
  "handle": "johndoe",
  "displayName": "John Doe",
  "bio": "Water fountain enthusiast",
  "image": "profile_image_url",
  "xp": 150,
  "moderator": false,
  "verified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "email": 0,
  "emailVerified": 0
}
```

**Error Responses:**
- `404 Not Found` - User does not exist
- `400 Bad Request` - Missing handle

---

### Update User Profile

```
PATCH /api/user
```

Updates the current authenticated user's profile.

**Authentication:** Required (Session)

**Headers:**
```
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "displayName": "New Display Name",
  "handle": "newhandle",
  "bio": "Updated bio text",
  "image": "https://example.com/new-profile-pic.jpg"
}
```

**Allowed Fields:**
- `displayName` (string)
- `handle` (string - username)
- `bio` (string)
- `image` (string - URL)

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "handle": "newhandle",
    "displayName": "New Display Name",
    "bio": "Updated bio text",
    "image": "https://example.com/new-profile-pic.jpg",
    "xp": 150,
    "moderator": false,
    "verified": false,
    "updatedAt": "2024-01-20T15:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Update failed (e.g., duplicate handle)

---

### Update Any User (Admin)

```
PATCH /api/users
```

Updates any user's profile. Requires moderator privileges or API token.

**Authentication:** Required (Moderator session or API Token)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN (if using API token)
```

**Request Body:**
```json
{
  "id": "user_id",
  "data": {
    "displayName": "Updated Name",
    "handle": "updatedhandle",
    "bio": "Updated bio",
    "image": "https://example.com/image.jpg",
    "xp": 1000,
    "moderator": true,
    "verified": true
  }
}
```

**Required Fields:**
- `id` (string) - User ID to update
- `data` (object) - Fields to update

**Response:**
```json
{
  "id": "user_id",
  "handle": "updatedhandle",
  "displayName": "Updated Name",
  "bio": "Updated bio",
  "xp": 1000,
  "moderator": true,
  "verified": true
}
```

**Authorization Rules:**
- Users can only update their own profile (via `/api/user`)
- Moderators can update any user
- API token holders can update any user

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a moderator and not the user being updated
- `400 Bad Request` - Missing id or data

---

### Promote/Demote Moderator

```
POST /api/users
```

Promotes or demotes a user to/from moderator status. Requires moderator privileges or API token.

**Authentication:** Required (Moderator session or API Token)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN (if using API token)
```

**Request Body:**
```json
{
  "action": "mod",
  "userId": "user_id"
}
```

**Required Fields:**
- `action` (string) - Either `"mod"` (promote) or `"unmod"` (demote)
- `userId` (string) - User ID to modify

**Actions:**
- `mod` - Promote user to moderator
- `unmod` - Demote user from moderator

**Response:**
```json
{
  "id": "user_id",
  "moderator": true,
  "updated": true
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a moderator
- `400 Bad Request` - Missing action or userId, or unknown action

---

## XP System Endpoints

The XP (Experience Points) system rewards users for contributions.

### Get Current User's XP

```
GET /api/xp
```

Returns the authenticated user's XP.

**Authentication:** Required (Session)

**Response:**
```json
{
  "userId": "user_id",
  "xp": 150
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated

---

### Get Specific User's XP

```
GET /api/xp?userId={userId}
```

Returns a specific user's XP.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID |

**Example:**
```bash
GET /api/xp?userId=user123
```

**Response:**
```json
{
  "userId": "user123",
  "xp": 250
}
```

---

### Get XP Leaderboard

```
GET /api/xp?action=leaderboard&limit={limit}
```

Returns the top users by XP.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `action` | string | Yes | - | Must be "leaderboard" |
| `limit` | number | No | 10 | Number of users to return |

**Example:**
```bash
GET /api/xp?action=leaderboard&limit=20
```

**Response:**
```json
{
  "leaderboard": [
    {
      "id": "user_id",
      "displayName": "John Doe",
      "handle": "johndoe",
      "image": "profile_image_url",
      "xp": 500,
      "verified": true
    },
    {
      "id": "user_id_2",
      "displayName": "Jane Smith",
      "handle": "janesmith",
      "image": "profile_image_url",
      "xp": 450,
      "verified": false
    }
  ]
}
```

### XP Rewards

Users earn XP for the following actions:

| Action | XP Earned | Description |
|--------|-----------|-------------|
| Create Waypoint | 30 XP | Adding a new water fountain location |
| Edit Waypoint | 15 XP | Updating an existing waypoint |
| Add Review | 10 XP | Reviewing a waypoint |

### XP Requirements

Certain actions require minimum XP:

| Action | XP Required | Description |
|--------|-------------|-------------|
| Create Waypoint | 750 XP | Minimum XP needed to create a waypoint |
| Edit Waypoint | 250 XP | Minimum XP needed to edit a waypoint |

**Notes:**
- XP requirements do not apply to moderators or API token users
- New users start with 0 XP
- XP cannot be decreased

---

## Stats Endpoints

### Get Platform Statistics

```
GET /api/stats
```

Returns overall platform statistics.

**Response:**
```json
{
  "totalWaypoints": 1523,
  "totalVerifiedWaypoints": 892,
  "totalUsers": 456,
  "totalReviews": 789,
  "totalContributions": 2341
}
```

**Statistics Included:**
- `totalWaypoints` - Total number of waypoints
- `totalVerifiedWaypoints` - Number of verified waypoints
- `totalUsers` - Total number of registered users
- `totalReviews` - Total number of reviews
- `totalContributions` - Total number of edit logs (contributions)

---

## Upload Endpoints

### Upload File

```
POST /api/upload
```

Uploads a file (typically a profile image) to S3-compatible storage.

**Authentication:** Required (Session)

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `file` (File) - The file to upload

**Example (using curl):**
```bash
curl -X POST https://bubblymaps.org/api/upload \
  -H "Cookie: your-session-cookie" \
  -F "file=@/path/to/image.jpg"
```

**Response:**
```json
{
  "url": "https://storage.example.com/profile_images/user_id-1234567890-image.jpg"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - No file uploaded
- `500 Internal Server Error` - Upload failed

**Notes:**
- Files are stored in the `profile_images/` directory
- File names are prefixed with user ID and timestamp
- Requires S3-compatible storage configuration (MinIO/AWS S3)

---

## Reports Endpoints

Users can report abuse or issues with waypoints or reviews.

### Get Reports

```
GET /api/reports?type={type}
```

Returns abuse reports filtered by type.

**Authentication:** Required (Session)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | Report type filter |

**Example:**
```bash
GET /api/reports?type=waypoint
```

**Response:**
```json
[
  {
    "id": 1,
    "type": "waypoint",
    "targetId": "123",
    "reason": "Inaccurate location",
    "reporterId": "user_id",
    "status": "pending",
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - Missing type parameter

---

### Create Report

```
POST /api/reports
```

Creates a new abuse report.

**Authentication:** Required (Session)

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "waypoint",
  "targetId": "123",
  "reason": "Inaccurate location - fountain has been removed"
}
```

**Required Fields:**
- `type` (string) - Type of report (e.g., "waypoint", "review", "user")
- `targetId` (string) - ID of the item being reported
- `reason` (string) - Reason for the report

**Response (201 Created):**
```json
{
  "id": 1,
  "type": "waypoint",
  "targetId": "123",
  "reason": "Inaccurate location - fountain has been removed",
  "reporterId": "user_id",
  "status": "pending",
  "createdAt": "2024-01-20T10:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - Missing required fields

---

## Moderator Endpoints

Moderator endpoints provide advanced search and management capabilities. All moderator endpoints require either moderator privileges or API token authentication.

### Moderator Search and Management

```
GET /api/moderator?type={type}
```

Search and manage bubblers (waypoints), reviews, users, and logs.

**Authentication:** Required (Moderator session or API Token)

**Headers (if using API token):**
```
Authorization: Bearer YOUR_API_TOKEN
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | string | No | bubblers | Data type to query: `bubblers`, `reviews`, `users`, `logs`, `recent` |
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 25 | Results per page |
| `q` | string | No | - | Search query (supports advanced search tokens) |

---

### Search Bubblers (Waypoints)

```
GET /api/moderator?type=bubblers
```

Search and filter waypoints with advanced query syntax.

**Advanced Search Tokens:**
- `id:123` - Find by exact ID
- `name:fountain` - Search by name
- `region:NYC` - Filter by region
- `maintainer:Parks` - Filter by maintainer
- `addedBy:johndoe` or `handle:johndoe` - Filter by user handle
- `approved:true` or `approved:false` - Filter by approval status
- `verified:true` or `verified:false` - Filter by verification status

**Examples:**
```bash
# Get all bubblers (paginated)
GET /api/moderator?type=bubblers&page=1&limit=25

# Search by name
GET /api/moderator?type=bubblers&q=park

# Advanced search: verified fountains in NYC
GET /api/moderator?type=bubblers&q=verified:true region:NYC

# Find by ID
GET /api/moderator?type=bubblers&q=id:123
```

**Response:**
```json
{
  "items": [
    {
      "id": 123,
      "name": "Central Park Fountain",
      "latitude": 40.785091,
      "longitude": -73.968285,
      "description": "Public drinking fountain",
      "region": "New York, NY",
      "maintainer": "NYC Parks",
      "verified": true,
      "approved": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "addedBy": {
        "id": "user_id",
        "displayName": "John Doe",
        "handle": "johndoe"
      }
    }
  ],
  "total": 1523
}
```

---

### Search Reviews

```
GET /api/moderator?type=reviews
```

Search and filter reviews with advanced query syntax.

**Advanced Search Tokens:**
- `id:123` - Find by exact review ID
- `bubblerId:456` - Filter by waypoint/bubbler ID
- `userId:user123` - Filter by user ID
- `handle:johndoe` or `username:johndoe` - Filter by user handle
- `displayName:John` - Filter by user display name
- `bubbler:fountain` - Search by waypoint name
- `comment:great` - Search in comment text
- `rating:5` - Filter by rating (1-5)

**Examples:**
```bash
# Get all reviews
GET /api/moderator?type=reviews&page=1&limit=25

# Find reviews for specific waypoint
GET /api/moderator?type=reviews&q=bubblerId:123

# Find reviews by user
GET /api/moderator?type=reviews&q=handle:johndoe

# Find 5-star reviews
GET /api/moderator?type=reviews&q=rating:5
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great fountain!",
      "userId": "user_id",
      "bubblerId": 123,
      "createdAt": "2024-01-16T12:00:00.000Z",
      "user": {
        "id": "user_id",
        "displayName": "John Doe",
        "handle": "johndoe"
      },
      "bubbler": {
        "id": 123,
        "name": "Central Park Fountain"
      }
    }
  ],
  "total": 789
}
```

---

### Search Users

```
GET /api/moderator?type=users
```

Search and filter users with advanced query syntax.

**Advanced Search Tokens:**
- `id:user123` - Find by exact user ID
- `handle:johndoe` - Search by handle
- `displayName:John` - Search by display name
- `email:user@example.com` - Search by email
- `moderator:true` or `moderator:false` - Filter by moderator status
- `verified:true` or `verified:false` - Filter by verification status
- `xp:1000` - Filter by exact XP amount

**Examples:**
```bash
# Get all users
GET /api/moderator?type=users&page=1&limit=25

# Search by name or handle
GET /api/moderator?type=users&q=john

# Find all moderators
GET /api/moderator?type=users&q=moderator:true

# Find verified users
GET /api/moderator?type=users&q=verified:true
```

**Response:**
```json
{
  "items": [
    {
      "id": "user_id",
      "handle": "johndoe",
      "displayName": "John Doe",
      "email": "user@example.com",
      "bio": "Water fountain enthusiast",
      "image": "profile_url",
      "xp": 150,
      "moderator": false,
      "verified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 456
}
```

---

### View Edit Logs

```
GET /api/moderator?type=logs
```

View all waypoint edit logs (audit trail).

**Examples:**
```bash
# Get recent edit logs
GET /api/moderator?type=logs&page=1&limit=25
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "action": "UPDATE",
      "userId": "user_id",
      "bubblerId": 123,
      "changes": {
        "description": {
          "old": "Old description",
          "new": "New description"
        }
      },
      "createdAt": "2024-01-20T14:00:00.000Z",
      "user": {
        "id": "user_id",
        "displayName": "John Doe",
        "handle": "johndoe"
      },
      "bubbler": {
        "id": 123,
        "name": "Central Park Fountain",
        "region": "New York, NY",
        "maintainer": "NYC Parks"
      }
    }
  ],
  "total": 2341
}
```

---

### Get Recent Activity

```
GET /api/moderator?type=recent
```

Get recent users, waypoints, reviews, and edits in a single request.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 25 | Number of items per category |

**Example:**
```bash
GET /api/moderator?type=recent&limit=10
```

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "handle": "johndoe",
      "displayName": "John Doe",
      "email": "user@example.com",
      "xp": 0,
      "moderator": false,
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "waypoints": [
    {
      "id": 123,
      "name": "New Fountain",
      "region": "NYC",
      "maintainer": "Parks Dept",
      "createdAt": "2024-01-20T11:00:00.000Z",
      "addedBy": {
        "id": "user_id",
        "handle": "johndoe",
        "displayName": "John Doe"
      }
    }
  ],
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Great!",
      "createdAt": "2024-01-20T12:00:00.000Z",
      "user": {
        "id": "user_id",
        "handle": "johndoe",
        "displayName": "John Doe"
      },
      "bubbler": {
        "id": 123,
        "name": "New Fountain"
      }
    }
  ],
  "edits": [
    {
      "id": 1,
      "action": "UPDATE",
      "createdAt": "2024-01-20T13:00:00.000Z",
      "user": {
        "id": "user_id",
        "handle": "johndoe",
        "displayName": "John Doe"
      },
      "bubbler": {
        "id": 123,
        "name": "New Fountain"
      }
    }
  ]
}
```

---

## Rate Limiting

Currently, the API does not implement rate limiting. However, excessive use may result in throttling or IP blocking at the infrastructure level.

**Best Practices:**
- Implement reasonable delays between requests
- Use pagination for large datasets
- Cache responses when appropriate
- Use webhooks or polling intervals for real-time data

---

## CORS Policy

The API supports CORS (Cross-Origin Resource Sharing) for web applications. By default, Next.js handles CORS configuration.

---

## Pagination

Many endpoints support pagination through query parameters:

**Standard Pagination Parameters:**
- `page` - Page number (default: 1)
- `limit` - Results per page (default: varies by endpoint, max: 100)

**Example:**
```bash
GET /api/moderator?type=users&page=2&limit=50
```

**Pagination in Responses:**
Some endpoints return a `total` field indicating the total number of results:
```json
{
  "items": [...],
  "total": 456
}
```

---

## Versioning

The API does not currently use versioning. All endpoints are accessed at the `/api` path. Breaking changes will be communicated through release notes and migration guides.

---

## Support

For API support, issues, or feature requests:
- **GitHub Issues:** [https://github.com/bubblymaps/maps/issues](https://github.com/bubblymaps/maps/issues)
- **Documentation:** [https://github.com/bubblymaps/maps/tree/main/docs](https://github.com/bubblymaps/maps/tree/main/docs)

---

## Additional Resources

- [XP System Documentation](./XP-SYSTEM.md) - Detailed XP rewards and requirements
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute to the project
- [Security Policy](../SECURITY.md) - Security guidelines and reporting
- [Code of Conduct](../CODE_OF_CONDUCT.md) - Community guidelines

---

*Last Updated: 2024-01-20*
