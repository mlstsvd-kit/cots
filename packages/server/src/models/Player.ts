import { PrismaClient, Player as PrismaPlayer } from '@prisma/client';

const prisma = new PrismaClient();

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

export class PlayerService {
  static async createPlayer(data: {
    username: string;
    email: string;
    avatar: string;
    oauthProvider: string;
    oauthId: string;
  }): Promise<PlayerProfile> {
    const player = await prisma.player.create({
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
    
    return player;
  }

  static async getPlayerById(id: string): Promise<PlayerProfile | null> {
    return await prisma.player.findUnique({
      where: { id }
    });
  }

  static async getPlayerByUsername(username: string): Promise<PlayerProfile | null> {
    return await prisma.player.findUnique({
      where: { username }
    });
  }

  static async updatePlayer(id: string, data: Partial<PlayerProfile>): Promise<PlayerProfile> {
    return await prisma.player.update({
      where: { id },
      data: data as any // Временное решение для частичного обновления
    });
  }

  static async getAllPlayers(): Promise<PlayerProfile[]> {
    return await prisma.player.findMany();
  }
}