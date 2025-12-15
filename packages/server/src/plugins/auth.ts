import fastify, { FastifyPluginAsync } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifySession from '@fastify/session';
import fastifyOAuth2 from 'fastify-oauth2';
import { config } from '../config';

export const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Регистрация JWT
  await fastify.register(fastifyJwt, {
    secret: config.jwtSecret
  });

  // Регистрация сессий
  await fastify.register(fastifySession, {
    cookieName: 'sessionId',
    secret: config.jwtSecret,
    cookie: {
      secure: config.environment === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      httpOnly: true,
      path: '/'
    }
  });

  // Регистрация OAuth2 для Яндекса
  if (config.yandexClientId && config.yandexClientSecret) {
    await fastify.register(fastifyOAuth2, {
      name: 'yandexOAuth2',
      scope: ['login:info', 'login:email'],
      credentials: {
        client: {
          id: config.yandexClientId,
          secret: config.yandexClientSecret
        },
        auth: fastifyOAuth2.YANDEX_CONFIGURATION
      },
      startRedirectPath: '/auth/yandex',
      callbackUri: `${config.corsOrigin}/auth/yandex/callback`
    });
  }

  // Регистрация OAuth2 для Google
  if (config.googleClientId && config.googleClientSecret) {
    await fastify.register(fastifyOAuth2, {
      name: 'googleOAuth2',
      scope: ['profile', 'email'],
      credentials: {
        client: {
          id: config.googleClientId,
          secret: config.googleClientSecret
        },
        auth: fastifyOAuth2.GOOGLE_CONFIGURATION
      },
      startRedirectPath: '/auth/google',
      callbackUri: `${config.corsOrigin}/auth/google/callback`
    });
  }

  // Добавляем декоратор для проверки аутентификации
 fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
};