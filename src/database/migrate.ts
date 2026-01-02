import { query, closePool } from './connection';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  logger.info('Iniciando migración de base de datos...');

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Tabla users creada');

    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Tabla categories creada');

    await query(`
      CREATE TABLE IF NOT EXISTS jokes (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    logger.info('Tabla jokes creada');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_jokes_user_id ON jokes(user_id);
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_jokes_category_id ON jokes(category_id);
    `);
    await query(`
      CREATE INDEX IF NOT EXISTS idx_jokes_user_category ON jokes(user_id, category_id);
    `);
    logger.info('Índices creados');

    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_jokes_updated_at ON jokes;
      CREATE TRIGGER update_jokes_updated_at
        BEFORE UPDATE ON jokes
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);
    logger.info('Trigger de actualización creado');

    logger.info('✅ Migración completada exitosamente');
  } catch (error) {
    logger.error('❌ Error durante la migración', error);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default migrate;

