import { ChuckNorrisService, chuckNorrisService } from './chuckNorris.service';
import { DadJokeService, dadJokeService } from './dadJoke.service';
import { JokeSource, ValidationError } from '../types';
import logger from '../utils/logger';

export class ExternalJokesService {
  private chuckService: ChuckNorrisService;
  private dadService: DadJokeService;

  constructor(
    chuckService: ChuckNorrisService = chuckNorrisService,
    dadService: DadJokeService = dadJokeService
  ) {
    this.chuckService = chuckService;
    this.dadService = dadService;
  }

  async getJokeBySource(source: JokeSource): Promise<string> {
    logger.info(`Fetching joke from source: ${source}`);

    switch (source) {
      case 'Chuck':
        return this.chuckService.getRandomJoke();
      case 'Dad':
        return this.dadService.getRandomJoke();
      default:
        logger.error(`Invalid joke source: ${source}`);
        throw new ValidationError('Fuente de chiste inválida. Use "Chuck" o "Dad"');
    }
  }

  async getRandomJoke(): Promise<string> {
    logger.info('Fetching random joke from random source');
    const sources: JokeSource[] = ['Chuck', 'Dad'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    return this.getJokeBySource(randomSource);
  }
}

export const externalJokesService = new ExternalJokesService();
