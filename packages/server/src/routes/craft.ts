import { FastifyPluginAsync } from 'fastify';
import { CraftService } from '../services/craftService';
import { CraftRecipe } from '@cas/shared';

export const craftRoutes: FastifyPluginAsync = async (fastify) => {
  // Маршрут для крафта техники
  fastify.post<{ Body: CraftRecipe }>('/craft/technique', async (request, reply) => {
    try {
      const recipe = request.body;
      
      // Проверяем аутентификацию пользователя
      // await fastify.authenticate(request, reply);
      
      const result = await CraftService.craftTechnique(recipe);
      
      if (result.success && result.technique) {
        // Здесь можно сохранить созданную технику в базу данных для пользователя
        // await saveTechniqueForUser(request.user.id, result.technique);
        
        return {
          success: true,
          technique: result.technique
        };
      } else {
        return reply.status(400).send({
          success: false,
          error: result.failureReason || 'Crafting failed'
        });
      }
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Маршрут для получения доступных рудиментов
  fastify.get('/craft/rudiments', async (request, reply) => {
    try {
      // Здесь можно получить рудименты из базы данных
      // const rudiments = await getAvailableRudiments(request.user.id);
      
      // Временно возвращаем тестовые данные
      return {
        rudiments: [
          { id: 'rud-1', name: 'Таран', description: 'Мощная атака с приближением к врагу', baseType: 'damage', elementType: 'fire' },
          { id: 'rud-2', name: 'Рычание Вызова', description: 'Деморализующий крик, снижающий вражескую защиту', baseType: 'control', elementType: 'fire' },
          { id: 'rud-3', name: 'Ледниковое Дыхание', description: 'Замораживающее дыхание, замедляющее врагов', baseType: 'control', elementType: 'water' },
          { id: 'rud-4', name: 'Бивень-Таран', description: 'Пронзающая атака с бивнями', baseType: 'damage', elementType: 'earth' }
        ]
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Маршрут для получения доступных фрагментов понимания
  fastify.get('/craft/fragments', async (request, reply) => {
    try {
      // Здесь можно получить фрагменты понимания из базы данных
      // const fragments = await getAvailableFragments(request.user.id);
      
      // Временно возвращаем тестовые данные
      return {
        fragments: [
          { id: 'frag-1', name: 'Раскол', description: 'Добавляет эффект разрушения', essence: 'earth' },
          { id: 'frag-2', name: 'Пылающий импульс', description: 'Добавляет огненный эффект', essence: 'fire' },
          { id: 'frag-3', name: 'Морозная ярость', description: 'Добавляет ледяной эффект', essence: 'water' },
          { id: 'frag-4', name: 'Вихрь', description: 'Добавляет ветровой эффект', essence: 'air' }
        ]
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Маршрут для получения доступных эссенций
  fastify.get('/craft/essences', async (request, reply) => {
    try {
      // Здесь можно получить эссенции из базы данных
      // const essences = await getAvailableEssences(request.user.id);
      
      // Временно возвращаем тестовые данные
      return {
        essences: [
          { id: 'ess-1', name: 'Огненная', element: 'fire', description: 'Придаёт технике огненные свойства' },
          { id: 'ess-2', name: 'Водяная', element: 'water', description: 'Придаёт технике водяные свойства' },
          { id: 'ess-3', name: 'Земная', element: 'earth', description: 'Придаёт технике земляные свойства' },
          { id: 'ess-4', name: 'Воздушная', element: 'air', description: 'Придаёт технике воздушные свойства' },
          { id: 'ess-5', name: 'Теневая', element: 'darkness', description: 'Придаёт технике теневые свойства' },
          { id: 'ess-6', name: 'Светлая', element: 'light', description: 'Придаёт технике светлые свойства' }
        ]
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};