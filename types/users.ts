export type User = {
  id: string;
  name: string | null;
  displayName: string | null;
  handle: string | null;
  bio: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  xp: number;
  verified: boolean;
  moderator: boolean;
  createdAt: Date;
  updatedAt: Date;
};
