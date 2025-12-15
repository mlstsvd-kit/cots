// Общие типы интерфейсы для проекта "Хроники Пробуждённых Душ"

// Типы духов
export interface Spirit {
  id: string;
  name: string;
  description: string;
  element: string;
  character: string;
  uniqueMechanic: string;
  rudiments: Rudiment[];
}

export interface Rudiment {
  id: string;
  name: string;
  description: string;
  baseType: 'damage' | 'control' | 'defense';
  elementType: string;
}

// Типы техник
export interface Technique {
  id: string;
  name: string;
  description: string;
  rudimentId: string;
  fragmentIds: string[];
  essence: string;
  elementType: string;
  level: number;
  isExperimental: boolean;
}

// Типы профиля игрока
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

// Типы аутентификации
export interface AuthResponse {
  token: string;
  user: PlayerProfile;
}

export interface OAuthProvider {
  provider: 'yandex' | 'google';
  accessToken: string;
  refreshToken?: string;
}

// Типы боевой системы
export interface BattleSetup {
 playerTechniques: Technique[];
  enemyTechniques: Technique[];
  location: string;
}

export interface BattleResult {
  winner: string;
  log: BattleLogEntry[];
  duration: number;
}

export interface BattleLogEntry {
  turn: number;
  actor: string;
  action: string;
 target?: string;
  damage?: number;
  effect?: string;
}

// Типы системы крафта
export interface CraftRecipe {
  rudimentId: string;
  fragmentIds: string[];
  essence: string;
}

export interface CraftResult {
  success: boolean;
  technique?: Technique;
  failureReason?: string;
}

// Перечисления для использования в системах
export enum ElementType {
  FIRE = 'fire',
  WATER = 'water',
  EARTH = 'earth',
  AIR = 'air',
  DARKNESS = 'darkness',
  LIGHT = 'light'
}

export enum TechniqueBaseType {
  DAMAGE = 'damage',
  CONTROL = 'control',
  DEFENSE = 'defense'
}

export enum PlayerRank {
  NOVICE = 'novice',
  APPRENTICE = 'apprentice',
  ADEPT = 'adept',
  MASTER = 'master',
  ASCENDED = 'ascended'
}