import { PlayerRegistrationData, PlayerProfile } from '../types/player';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  static async registerOAuthUser(data: PlayerRegistrationData): Promise<PlayerProfile> {
    // Проверяем, существует ли уже пользователь с таким oauthId и провайдером
    let existingUser = await prisma.player.findFirst({
      where: {
        oauthProvider: data.oauthProvider,
        oauthId: data.oauthId
      }
    });

    if (existingUser) {
      // Обновляем данные существующего пользователя
      existingUser = await prisma.player.update({
        where: { id: existingUser.id },
        data: {
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          lastLoginAt: new Date()
        }
      });
      return existingUser;
    }

    // Проверяем, существует ли пользователь с таким email
    const existingEmailUser = await prisma.player.findUnique({
      where: { email: data.email }
    });

    if (existingEmailUser) {
      // Обновляем данные пользователя, добавляя OAuth информацию
      const updatedUser = await prisma.player.update({
        where: { id: existingEmailUser.id },
        data: {
          oauthProvider: data.oauthProvider,
          oauthId: data.oauthId,
          username: data.username,
          avatar: data.avatar,
          lastLoginAt: new Date()
        }
      });
      return updatedUser;
    }

    // Создаем нового пользователя
    const newUser = await prisma.player.create({
      data: {
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        oauthProvider: data.oauthProvider,
        oauthId: data.oauthId,
        power: 0,
        harmony: 0,
        understanding: 0
      }
    });

    return newUser;
  }

 static async getUserById(id: string): Promise<PlayerProfile | null> {
    const user = await prisma.player.findUnique({
      where: { id }
    });
    return user;
  }

  static async getUserByUsername(username: string): Promise<PlayerProfile | null> {
    const user = await prisma.player.findUnique({
      where: { username }
    });
    return user;
  }
}