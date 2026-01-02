import { JokeRepository, jokeRepository } from '../repositories/joke.repository';
import { Joke, JokeCreateDTO, JokeUpdateDTO, ValidationError, NotFoundError } from '../types';
import logger from '../utils/logger';

export class JokesService {
  private repository: JokeRepository;

  constructor(repository: JokeRepository = jokeRepository) {
    this.repository = repository;
  }

  private validateId(id: number): void {
    if (!id || id <= 0 || !Number.isInteger(id)) {
      throw new ValidationError('ID inválido');
    }
  }

  private validateText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new ValidationError('El texto del chiste es requerido');
    }
  }

  async getAllJokes(): Promise<Joke[]> {
    logger.info('Fetching all jokes');
    return this.repository.findAll();
  }

  async getJokeById(id: number): Promise<Joke> {
    logger.info(`Fetching joke ID: ${id}`);
    this.validateId(id);

    const joke = await this.repository.findById(id);
    if (!joke) {
      throw new NotFoundError('Chiste no encontrado');
    }
    return joke;
  }

  async createJoke(data: JokeCreateDTO): Promise<Joke> {
    logger.info('Creating new joke');
    this.validateText(data.text);
    return this.repository.create(data);
  }

  async updateJoke(id: number, data: JokeUpdateDTO): Promise<Joke> {
    logger.info(`Updating joke ID: ${id}`);
    this.validateId(id);
    this.validateText(data.text);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Chiste no encontrado');
    }

    return this.repository.update(id, data);
  }

  async deleteJoke(id: number): Promise<boolean> {
    logger.info(`Deleting joke ID: ${id}`);
    this.validateId(id);

    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('Chiste no encontrado');
    }

    return this.repository.delete(id);
  }

  async getJokesByUserId(userId: number): Promise<Joke[]> {
    logger.info(`Fetching jokes for user ID: ${userId}`);
    this.validateId(userId);
    return this.repository.findByUserId(userId);
  }

  async getJokesByUserName(userName: string): Promise<Joke[]> {
    logger.info(`Fetching jokes for user: ${userName}`);
    if (!userName || userName.trim().length === 0) {
      throw new ValidationError('Nombre de usuario requerido');
    }
    return this.repository.findByUserName(userName);
  }

  async getJokesByCategoryId(categoryId: number): Promise<Joke[]> {
    logger.info(`Fetching jokes for category ID: ${categoryId}`);
    this.validateId(categoryId);
    return this.repository.findByCategoryId(categoryId);
  }

  async getJokesByCategoryName(categoryName: string): Promise<Joke[]> {
    logger.info(`Fetching jokes for category: ${categoryName}`);
    if (!categoryName || categoryName.trim().length === 0) {
      throw new ValidationError('Nombre de categoría requerido');
    }
    return this.repository.findByCategoryName(categoryName);
  }

  async getJokesByUserAndCategory(userId: number, categoryId: number): Promise<Joke[]> {
    logger.info(`Fetching jokes for user ${userId} and category ${categoryId}`);
    this.validateId(userId);
    this.validateId(categoryId);
    return this.repository.findByUserAndCategory(userId, categoryId);
  }

  async getJokesByUserNameAndCategoryName(userName: string, categoryName: string): Promise<Joke[]> {
    logger.info(`Fetching jokes for ${userName} in category ${categoryName}`);
    if (!userName || userName.trim().length === 0) {
      throw new ValidationError('Nombre de usuario requerido');
    }
    if (!categoryName || categoryName.trim().length === 0) {
      throw new ValidationError('Nombre de categoría requerido');
    }
    return this.repository.findByUserNameAndCategoryName(userName, categoryName);
  }
}

export const jokesService = new JokesService();
