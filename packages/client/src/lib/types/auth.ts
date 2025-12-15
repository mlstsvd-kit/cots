// Типы аутентификации для клиента

export interface User {
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

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OAuthProvider {
  provider: 'yandex' | 'google';
}