import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

export function createApp(): Application {
  const app = express();

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API de Chistes - Documentación',
    }));
    logger.info('Swagger UI available at /api-docs');
  } catch (error) {
    logger.warn('Could not load Swagger documentation');
  }

  app.get('/', (req, res) => {
    res.json({
      message: '🎭 API de Chistes - Bienvenido',
      version: '1.0.0',
      endpoints: {
        docs: '/api-docs',
        health: '/api/health',
        chistes: {
          aleatorio: 'GET /api/chistes',
          porFuente: 'GET /api/chistes/:source (Chuck | Dad)',
          emparejados: 'GET /api/chistes/emparejados',
          baseDatos: 'GET /api/chistes/db',
          crear: 'POST /api/chistes',
          actualizar: 'PUT /api/chistes/:number',
          eliminar: 'DELETE /api/chistes/:number',
          consultas: {
            porUsuario: 'GET /api/chistes/usuario/:userName',
            porCategoria: 'GET /api/chistes/categoria/:categoryName',
            combinada: 'GET /api/chistes/usuario/:userName/categoria/:categoryName',
          },
        },
        matematicas: {
          mcm: 'GET /api/math/lcm?numbers=2,3,4',
          incrementar: 'GET /api/math/increment?number=5',
        },
      },
    });
  });

  app.use('/api', routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
