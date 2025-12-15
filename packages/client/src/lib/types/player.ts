// Типы, связанные с профилем игрока

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
  unlockedSpirits: string[]; // IDs духов, которые игрок может использовать
  auraId?: string;
  auraLevel: number;
  schoolId?: string;
  schoolRank?: string;
}

export interface PlayerStats {
  power: number;
  harmony: number;
  understanding: number;
}