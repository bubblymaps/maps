export type Waypoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  addedByUserId?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  addedBy: {
    id: number;
    image: string | null;
    displayName: string | null;
    handle: string | null;
  }
  image?: string | null;
  maintainer?: string | null;
  amenities: string[];
  approved: boolean;
  region?: string | null;
  reviews?: Review[] | null;
};

export interface Review {
  id: number
  rating: number
  comment?: string
  createdAt: string
  user: {
    handle: string
  }
}

export type Announcement = {
  announcement: string;
  link: string;
};

export type Stats = {
  users: number;
  bubblers: number;
  reviews: number;
};

export type AdminStats = {
  users: number;
  bubblers: number;
  reviews: number;
  awaitingApproval: number;
  verified: number;
}