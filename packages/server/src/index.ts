import fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';
import { authPlugin } from './plugins/auth';
import { authRoutes } from './routes/auth';
import { spiritRoutes } from './routes/spirits';
import { craftRoutes } from './routes/craft';
import { battleRoutes } from './routes/battle';
import { narrativeRoutes } from './routes/narrative';
import { SpiritService } from './models/Spirit';

const app = fastify({ logger: true });

app.register(cors, {
  origin: config.corsOrigin,
  credentials: true
});

// Регистрация плагинов
app.register(authPlugin);

// Регистрация маршрутов
app.register(authRoutes);
app.register(spiritRoutes);
app.register(craftRoutes);
app.register(battleRoutes);
app.register(narrativeRoutes);

app.get('/health', async (req, res) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Инициализация при запуске
const start = async () => {
  try {
    // Создание начальных духов
    await SpiritService.createInitialSpirits();
    
    await app.listen({ port: config.port, host: '0.0.0' });
    console.log(`Server running on port ${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();