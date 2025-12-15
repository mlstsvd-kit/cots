import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback_jwt_secret_for_development',
  yandexClientId: process.env.YANDEX_CLIENT_ID || '',
  yandexClientSecret: process.env.YANDEX_CLIENT_SECRET || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  environment: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};