export type Waypoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
};

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