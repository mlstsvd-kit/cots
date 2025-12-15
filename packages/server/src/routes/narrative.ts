import { FastifyPluginAsync } from 'fastify';
import { NarrativeGenerator, LocationContext, SpiritContext, TechniqueContext } from '../services/narrativeService';

export const narrativeRoutes: FastifyPluginAsync = async (fastify) => {
  // Генерация описания входа в локацию
 fastify.post('/narrative/location-entry', async (request: any, reply) => {
    try {
      const { playerName, location, spirit } = request.body as {
        playerName: string;
        location: LocationContext;
        spirit: SpiritContext;
      };
      
      const narrative = NarrativeGenerator.generateLocationEntry(playerName, location, spirit);
      
      return { narrative };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Генерация описания боевого действия
  fastify.post('/narrative/battle-action', async (request: any, reply) => {
    try {
      const { playerName, technique, targetName, damage, effect } = request.body as {
        playerName: string;
        technique: TechniqueContext;
        targetName: string;
        damage?: number;
        effect?: string;
      };
      
      const narrative = NarrativeGenerator.generateBattleAction(playerName, technique, targetName, damage, effect);
      
      return { narrative };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Генерация описания активации ауры
  fastify.post('/narrative/aura-activation', async (request: any, reply) => {
    try {
      const { playerName, spirit, auraName } = request.body as {
        playerName: string;
        spirit: SpiritContext;
        auraName: string;
      };
      
      const narrative = NarrativeGenerator.generateAuraActivation(playerName, spirit, auraName);
      
      return { narrative };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};