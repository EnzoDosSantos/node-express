import { query } from '../database/connection';
import { Joke, JokeCreateDTO, JokeUpdateDTO } from '../types';
import logger from '../utils/logger';

interface JokeRow {
  id: number;
  text: string;
  user_id: number | null;
  category_id: number | null;
  created_at: Date;
  updated_at: Date;
}

function mapRowToJoke(row: JokeRow): Joke {
  return {
    id: row.id,
    text: row.text,
    userId: row.user_id ?? undefined,
    categoryId: row.category_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class JokeRepository {
  async findAll(): Promise<Joke[]> {
    logger.debug('Fetching all jokes');
    const rows = await query<JokeRow>('SELECT * FROM jokes ORDER BY id');
    return rows.map(mapRowToJoke);
  }

  async findById(id: number): Promise<Joke | null> {
    logger.debug(`Finding joke with ID: ${id}`);
    const rows = await query<JokeRow>('SELECT * FROM jokes WHERE id = $1', [id]);
    return rows.length > 0 ? mapRowToJoke(rows[0]) : null;
  }

  async create(data: JokeCreateDTO): Promise<Joke> {
    logger.debug('Creating new joke');
    const rows = await query<JokeRow>(
      'INSERT INTO jokes (text, user_id, category_id) VALUES ($1, $2, $3) RETURNING *',
      [data.text, data.userId || null, data.categoryId || null]
    );
    return mapRowToJoke(rows[0]);
  }

  async update(id: number, data: JokeUpdateDTO): Promise<Joke> {
    logger.debug(`Updating joke ID: ${id}`);
    const rows = await query<JokeRow>(
      'UPDATE jokes SET text = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [data.text, id]
    );
    return mapRowToJoke(rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    logger.debug(`Deleting joke ID: ${id}`);
    const result = await query('DELETE FROM jokes WHERE id = $1 RETURNING id', [id]);
    return result.length > 0;
  }

  async findByUserId(userId: number): Promise<Joke[]> {
    logger.debug(`Finding jokes for user ID: ${userId}`);
    const rows = await query<JokeRow>(
      'SELECT * FROM jokes WHERE user_id = $1 ORDER BY id',
      [userId]
    );
    return rows.map(mapRowToJoke);
  }

  async findByUserName(userName: string): Promise<Joke[]> {
    logger.debug(`Finding jokes for user: ${userName}`);
    const rows = await query<JokeRow>(
      `SELECT j.* FROM jokes j 
       INNER JOIN users u ON j.user_id = u.id 
       WHERE LOWER(u.name) = LOWER($1) 
       ORDER BY j.id`,
      [userName]
    );
    return rows.map(mapRowToJoke);
  }

  async findByCategoryId(categoryId: number): Promise<Joke[]> {
    logger.debug(`Finding jokes for category ID: ${categoryId}`);
    const rows = await query<JokeRow>(
      'SELECT * FROM jokes WHERE category_id = $1 ORDER BY id',
      [categoryId]
    );
    return rows.map(mapRowToJoke);
  }

  async findByCategoryName(categoryName: string): Promise<Joke[]> {
    logger.debug(`Finding jokes for category: ${categoryName}`);
    const rows = await query<JokeRow>(
      `SELECT j.* FROM jokes j 
       INNER JOIN categories c ON j.category_id = c.id 
       WHERE LOWER(c.name) = LOWER($1) 
       ORDER BY j.id`,
      [categoryName]
    );
    return rows.map(mapRowToJoke);
  }

  async findByUserAndCategory(userId: number, categoryId: number): Promise<Joke[]> {
    logger.debug(`Finding jokes for user ${userId} and category ${categoryId}`);
    const rows = await query<JokeRow>(
      'SELECT * FROM jokes WHERE user_id = $1 AND category_id = $2 ORDER BY id',
      [userId, categoryId]
    );
    return rows.map(mapRowToJoke);
  }

  async findByUserNameAndCategoryName(userName: string, categoryName: string): Promise<Joke[]> {
    logger.debug(`Finding jokes for ${userName} in category ${categoryName}`);
    const rows = await query<JokeRow>(
      `SELECT j.* FROM jokes j 
       INNER JOIN users u ON j.user_id = u.id 
       INNER JOIN categories c ON j.category_id = c.id 
       WHERE LOWER(u.name) = LOWER($1) AND LOWER(c.name) = LOWER($2) 
       ORDER BY j.id`,
      [userName, categoryName]
    );
    return rows.map(mapRowToJoke);
  }
}

export const jokeRepository = new JokeRepository();
