import axios from 'axios';
import { ExternalApiError, DadJoke } from '../types';
import logger from '../utils/logger';

const DAD_JOKES_API_URL = 'https://icanhazdadjoke.com/';

export class DadJokeService {
  private apiUrl: string;

  constructor(apiUrl: string = DAD_JOKES_API_URL) {
    this.apiUrl = apiUrl;
  }

  async getRandomJoke(): Promise<string> {
    logger.info('Fetching random Dad Joke');

    try {
      const response = await axios.get<DadJoke>(this.apiUrl, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.data || !response.data.joke) {
        logger.error('Invalid response from Dad Jokes API');
        throw new ExternalApiError('Respuesta inválida de la API');
      }

      const joke = response.data.joke;
      logger.debug(`Dad Joke fetched: ${joke.substring(0, 50)}...`);
      return joke;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }

      logger.error('Error fetching Dad Joke', { error });
      throw new ExternalApiError('Error obteniendo chiste de Dad Jokes');
    }
  }
}

export const dadJokeService = new DadJokeService();
