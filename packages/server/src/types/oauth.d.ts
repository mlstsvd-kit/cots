declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DATABASE_URL: string;
      JWT_SECRET: string;
      YANDEX_CLIENT_ID: string;
      YANDEX_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      REDIS_URL: string;
      NODE_ENV: 'development' | 'production';
      CORS_ORIGIN: string;
    }
  }
}

export {};