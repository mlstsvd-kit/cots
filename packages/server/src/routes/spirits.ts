import { FastifyPluginAsync } from 'fastify';
import { SpiritService } from '../models/Spirit';

export const spiritRoutes: FastifyPluginAsync = async (fastify) => {
  // Получить все духи
  fastify.get('/spirits', async (request, reply) => {
    try {
      const spirits = await SpiritService.getAllSpirits();
      return spirits;
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Получить дух по ID
  fastify.get('/spirits/:id', async (request: any, reply) => {
    try {
      const { id } = request.params as { id: string };
      const spirit = await SpiritService.getSpiritById(id);
      
      if (!spirit) {
        return reply.status(404).send({ error: 'Spirit not found' });
      }
      
      return spirit;
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Получить рудименты духа
  fastify.get('/spirits/:id/rudiments', async (request: any, reply) => {
    try {
      const { id } = request.params as { id: string };
      const rudiments = await SpiritService.getSpiritRudiments(id);
      
      return rudiments;
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};