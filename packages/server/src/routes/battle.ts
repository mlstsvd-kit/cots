import { FastifyPluginAsync } from 'fastify';
import { BattleService } from '../services/battleService';
import { BattleSetup } from '@cas/shared';

export const battleRoutes: FastifyPluginAsync = async (fastify) => {
  // Маршрут для начала боя
  fastify.post<{ Body: BattleSetup }>('/battle/start', async (request, reply) => {
    try {
      // Проверяем аутентификацию пользователя
      // await fastify.authenticate(request, reply);
      
      const battleSetup = request.body;
      
      // Запускаем бой
      const result = await BattleService.startBattle(battleSetup);
      
      return result;
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Маршрут для получения доступных техник для боя
  fastify.get('/battle/techniques', async (request, reply) => {
    try {
      // Здесь можно получить техники пользователя из базы данных
      // const techniques = await getUserTechniques(request.user.id);
      
      // Временно возвращаем тестовые данные
      return {
        techniques: [
          { id: 'tech-1', name: 'Таран', rudimentId: 'rud-1', elementType: 'fire', baseType: 'damage' },
          { id: 'tech-2', name: 'Рычание Вызова', rudimentId: 'rud-2', elementType: 'fire', baseType: 'control' },
          { id: 'tech-3', name: 'Ледниковое Дыхание', rudimentId: 'rud-3', elementType: 'water', baseType: 'control' },
          { id: 'tech-4', name: 'Бивень-Таран', rudimentId: 'rud-4', elementType: 'earth', baseType: 'damage' }
        ]
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Маршрут для получения списка доступных локаций
  fastify.get('/battle/locations', async (request, reply) => {
    try {
      // Здесь можно получить локации из базы данных
      // const locations = await getAvailableLocations();
      
      // Временно возвращаем тестовые данные
      return {
        locations: [
          { id: 'loc-1', name: 'Руины Забытого Алтаря', element: 'earth', level: 1 },
          { id: 'loc-2', name: 'Подземелье Теней', element: 'darkness', level: 3 },
          { id: 'loc-3', name: 'Вершина Пылающей Горы', element: 'fire', level: 5 },
          { id: 'loc-4', name: 'Лес Древних Стражей', element: 'earth', level: 2 }
        ]
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
};