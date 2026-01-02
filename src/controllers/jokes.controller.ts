import { Request, Response, NextFunction } from 'express';
import { JokesService, jokesService } from '../services/jokes.service';
import { ExternalJokesService, externalJokesService } from '../services/externalJokes.service';
import { PairedJokesService, pairedJokesService } from '../services/pairedJokes.service';
import { JokeSource, ValidationError } from '../types';
import logger from '../utils/logger';

export class JokesController {
  private jokesService: JokesService;
  private externalJokesService: ExternalJokesService;
  private pairedJokesService: PairedJokesService;

  constructor(
    jokesServiceInstance: JokesService = jokesService,
    externalJokesServiceInstance: ExternalJokesService = externalJokesService,
    pairedJokesServiceInstance: PairedJokesService = pairedJokesService
  ) {
    this.jokesService = jokesServiceInstance;
    this.externalJokesService = externalJokesServiceInstance;
    this.pairedJokesService = pairedJokesServiceInstance;
  }

  getJoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { source } = req.params;
      logger.info(`GET /chistes - source: ${source || 'random'}`);

      let joke: string;

      if (!source) {
        joke = await this.externalJokesService.getRandomJoke();
      } else if (source === 'Chuck' || source === 'Dad') {
        joke = await this.externalJokesService.getJokeBySource(source as JokeSource);
      } else {
        throw new ValidationError('Fuente inválida. Use "Chuck" o "Dad"');
      }

      res.json({
        success: true,
        data: { joke, source: source || 'random' },
      });
    } catch (error) {
      next(error);
    }
  };

  createJoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { text, userId, categoryId } = req.body;
      logger.info('POST /chistes - Creating new joke');

      if (!text) {
        throw new ValidationError('El campo "text" es requerido');
      }

      const joke = await this.jokesService.createJoke({ text, userId, categoryId });

      res.status(201).json({
        success: true,
        data: joke,
        message: 'Chiste creado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };

  updateJoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { number } = req.params;
      const { text } = req.body;
      logger.info(`PUT /chistes/${number} - Updating joke`);

      const id = parseInt(number, 10);
      if (isNaN(id) || id <= 0) {
        throw new ValidationError('El parámetro "number" debe ser un número entero positivo');
      }

      if (!text) {
        throw new ValidationError('El campo "text" es requerido');
      }

      const joke = await this.jokesService.updateJoke(id, { text });

      res.json({
        success: true,
        data: joke,
        message: 'Chiste actualizado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJoke = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { number } = req.params;
      logger.info(`DELETE /chistes/${number} - Deleting joke`);

      const id = parseInt(number, 10);
      if (isNaN(id) || id <= 0) {
        throw new ValidationError('El parámetro "number" debe ser un número entero positivo');
      }

      await this.jokesService.deleteJoke(id);

      res.json({
        success: true,
        message: 'Chiste eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };

  getPairedJokes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('GET /chistes/emparejados - Fetching paired jokes');

      const pairedJokes = await this.pairedJokesService.getPairedJokes();

      res.json({
        success: true,
        data: pairedJokes,
        count: pairedJokes.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllJokesFromDb = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('GET /chistes/db - Fetching jokes from DB');

      const jokes = await this.jokesService.getAllJokes();

      res.json({
        success: true,
        data: jokes,
        count: jokes.length,
      });
    } catch (error) {
      next(error);
    }
  };

  getJokeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      logger.info(`GET /chistes/db/${id} - Fetching joke by ID`);

      const jokeId = parseInt(id, 10);
      if (isNaN(jokeId)) {
        throw new ValidationError('El ID debe ser un número');
      }

      const joke = await this.jokesService.getJokeById(jokeId);

      res.json({
        success: true,
        data: joke,
      });
    } catch (error) {
      next(error);
    }
  };

  getJokesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userName } = req.params;
      logger.info(`GET /chistes/usuario/${userName} - Query jokes by user`);

      const jokes = await this.jokesService.getJokesByUserName(userName);

      res.json({
        success: true,
        data: jokes,
        count: jokes.length,
        query: `Chistes del usuario "${userName}"`,
      });
    } catch (error) {
      next(error);
    }
  };

  getJokesByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryName } = req.params;
      logger.info(`GET /chistes/categoria/${categoryName} - Query jokes by category`);

      const jokes = await this.jokesService.getJokesByCategoryName(categoryName);

      res.json({
        success: true,
        data: jokes,
        count: jokes.length,
        query: `Chistes de la temática "${categoryName}"`,
      });
    } catch (error) {
      next(error);
    }
  };

  getJokesByUserAndCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userName, categoryName } = req.params;
      logger.info(`GET /chistes/usuario/${userName}/categoria/${categoryName} - Combined query`);

      const jokes = await this.jokesService.getJokesByUserNameAndCategoryName(userName, categoryName);

      res.json({
        success: true,
        data: jokes,
        count: jokes.length,
        query: `Chistes de "${categoryName}" creados por "${userName}"`,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const jokesController = new JokesController();
