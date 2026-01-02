import dotenv from 'dotenv';

dotenv.config();

import { createApp } from './app';
import { testConnection } from './database/connection';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.warn('⚠️  No se pudo conectar a PostgreSQL. La API funcionará sin base de datos.');
      logger.warn('    Los endpoints que requieren BD devolverán errores.');
      logger.warn('    Ejecute: npm run migrate && npm run seed para configurar la BD.');
    }

    const app = createApp();

    app.listen(PORT, () => {
      logger.info('='.repeat(60));
      logger.info(`🚀 Servidor iniciado en http://localhost:${PORT}`);
      logger.info(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
      logger.info(`❤️  Health check: http://localhost:${PORT}/api/health`);
      logger.info('='.repeat(60));
      logger.info('');
      logger.info('📋 Endpoints disponibles:');
      logger.info('');
      logger.info('   CHISTES:');
      logger.info(`   GET    http://localhost:${PORT}/api/chistes`);
      logger.info(`   GET    http://localhost:${PORT}/api/chistes/Chuck`);
      logger.info(`   GET    http://localhost:${PORT}/api/chistes/Dad`);
      logger.info(`   GET    http://localhost:${PORT}/api/chistes/emparejados`);
      logger.info(`   POST   http://localhost:${PORT}/api/chistes`);
      logger.info(`   PUT    http://localhost:${PORT}/api/chistes/:number`);
      logger.info(`   DELETE http://localhost:${PORT}/api/chistes/:number`);
      logger.info('');
      logger.info('   MATEMÁTICAS:');
      logger.info(`   GET    http://localhost:${PORT}/api/math/lcm?numbers=2,3,4`);
      logger.info(`   GET    http://localhost:${PORT}/api/math/increment?number=5`);
      logger.info('');
      logger.info('   CONSULTAS SQL:');
      logger.info(`   GET    http://localhost:${PORT}/api/chistes/usuario/Manolito`);
      logger.info(`   GET    http://localhost:${PORT}/api/chistes/categoria/humor%20negro`);
      logger.info(`   GET    http://localhost:${PORT}/api/chistes/usuario/Manolito/categoria/humor%20negro`);
      logger.info('='.repeat(60));
    });
  } catch (error) {
    logger.error('Error fatal iniciando el servidor:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  logger.info('Recibida señal SIGTERM. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Recibida señal SIGINT. Cerrando servidor...');
  process.exit(0);
});

startServer();

