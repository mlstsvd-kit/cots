export interface PlayerProfile {
  id: string;
  username: string;
 email: string;
  avatar: string;
  spiritId: string | null;
  power: number;
 harmony: number;
  understanding: number;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface PlayerRegistrationData {
  username: string;
  email: string;
 avatar: string;
 oauthProvider: string;
  oauthId: string;
}