import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Роут для получения информации о пользователе
  fastify.get('/auth/me', async (request: any, reply) => {
    try {
      // Получаем информацию из сессии
      const session = request.session;
      if (!session.userId) {
        return reply.status(401).send({ error: 'Not authenticated' });
      }

      // Получаем данные пользователя из базы
      const user = await prisma.player.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          spiritId: true,
          power: true,
          createdAt: true
        }
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return { user };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Роут для выхода из системы
  fastify.post('/auth/logout', async (request: any, reply) => {
    request.session.destroy();
    return { success: true };
  });

  // Роут для Яндекс OAuth callback
  if (config.yandexClientId && config.yandexClientSecret) {
    fastify.get('/auth/yandex/callback', async (request: any, reply) => {
      try {
        const token = await fastify.yandexOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

        // Получаем информацию о пользователе из Яндекса
        const userInfoResponse = await fetch('https://login.yandex.ru/info?format=json', {
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
        });
        const userInfo = await userInfoResponse.json();

        // Проверяем, существует ли уже пользователь с таким OAuth ID
        let user = await prisma.player.findFirst({
          where: {
            oauthProvider: 'yandex',
            oauthId: userInfo.id
          }
        });

        if (!user) {
          // Создаем нового пользователя
          user = await prisma.player.create({
            data: {
              username: userInfo.login || userInfo.display_name || `yandex_user_${userInfo.id}`,
              email: userInfo.default_email || '',
              avatar: userInfo.avatar || '',
              oauthProvider: 'yandex',
              oauthId: userInfo.id,
              power: 0,
              harmony: 0,
              understanding: 0
            }
          });
        } else {
          // Обновляем информацию о существующем пользователе
          user = await prisma.player.update({
            where: { id: user.id },
            data: {
              username: userInfo.login || userInfo.display_name || user.username,
              avatar: userInfo.avatar || user.avatar,
              lastLoginAt: new Date()
            }
          });
        }

        // Сохраняем информацию о пользователе в сессию
        request.session.userId = user.id;
        request.session.oauthProvider = 'yandex';
        request.session.oauthId = userInfo.id;

        // Редирект на фронтенд с токеном
        reply.redirect(`${config.corsOrigin}/dashboard`);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Authentication failed' });
      }
    });
  }

  // Роут для Google OAuth callback
  if (config.googleClientId && config.googleClientSecret) {
    fastify.get('/auth/google/callback', async (request: any, reply) => {
      try {
        const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

        // Получаем информацию о пользователе из Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${token.access_token}`
          }
        });
        const userInfo = await userInfoResponse.json();

        // Проверяем, существует ли уже пользователь с таким OAuth ID
        let user = await prisma.player.findFirst({
          where: {
            oauthProvider: 'google',
            oauthId: userInfo.id
          }
        });

        if (!user) {
          // Создаем нового пользователя
          user = await prisma.player.create({
            data: {
              username: userInfo.name || `google_user_${userInfo.id}`,
              email: userInfo.email || '',
              avatar: userInfo.picture || '',
              oauthProvider: 'google',
              oauthId: userInfo.id,
              power: 0,
              harmony: 0,
              understanding: 0
            }
          });
        } else {
          // Обновляем информацию о существующем пользователе
          user = await prisma.player.update({
            where: { id: user.id },
            data: {
              username: userInfo.name || user.username,
              avatar: userInfo.picture || user.avatar,
              lastLoginAt: new Date()
            }
          });
        }

        // Сохраняем информацию о пользователе в сессию
        request.session.userId = user.id;
        request.session.oauthProvider = 'google';
        request.session.oauthId = userInfo.id;

        // Редирект на фронтенд с токеном
        reply.redirect(`${config.corsOrigin}/dashboard`);
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: 'Authentication failed' });
      }
    });
  }
};