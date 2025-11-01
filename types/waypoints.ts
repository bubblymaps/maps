export interface Waypoint {
  id: number
  name: string
  latitude: number
  longitude: number
  description?: string
  addedByUserId?: string
  addedBy?: {
    id: string
    name?: string
    email?: string
    handle?: string
    verified?: boolean
    moderator?: boolean
  }
  amenities: string[]
  verified: boolean
  approved: boolean
  createdAt: string | Date
  updatedAt: string | Date
  image?: string
  maintainer?: string
  region?: string
  reviews?: {
    id: number
    rating: number
    comment?: string
    createdAt: string | Date
    updatedAt: string | Date
  }[]
}
