import { Pool, PoolConfig } from 'pg';
import logger from '../utils/logger';

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'jokes_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  logger.error('Error inesperado en el pool de PostgreSQL', err);
});

pool.on('connect', () => {
  logger.debug('Nueva conexión establecida al pool de PostgreSQL');
});

/**
 * Execute a SQL query
 * @param text Consulta SQL
 * @param params Parámetros de la consulta
 */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Consulta ejecutada en ${duration}ms: ${text.substring(0, 50)}...`);
    return result.rows as T[];
  } catch (error) {
    logger.error(`Error ejecutando consulta: ${text}`, error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  const client = await pool.connect();
  const originalRelease = client.release.bind(client);

  const timeout = setTimeout(() => {
    logger.error('Cliente de BD no liberado a tiempo. Forzando liberación.');
    client.release();
  }, 10000);

  client.release = () => {
    clearTimeout(timeout);
    return originalRelease();
  };

  return client;
}

/**
 * Verify the connection to the database
 */
export async function testConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT NOW()');
    logger.info('Conexión a PostgreSQL establecida correctamente');
    return true;
  } catch (error) {
    logger.error('Error conectando a PostgreSQL', error);
    return false;
  }
}

/**
 * Cierra todas las conexiones del pool
 */
export async function closePool(): Promise<void> {
  await pool.end();
  logger.info('Pool de PostgreSQL cerrado');
}

export default pool;

