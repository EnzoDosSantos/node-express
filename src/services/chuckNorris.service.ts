import axios from 'axios';
import { ExternalApiError, ChuckNorrisJoke } from '../types';
import logger from '../utils/logger';

const CHUCK_NORRIS_API_URL = 'https://api.chucknorris.io/jokes/random';

export class ChuckNorrisService {
  private apiUrl: string;

  constructor(apiUrl: string = CHUCK_NORRIS_API_URL) {
    this.apiUrl = apiUrl;
  }

  async getRandomJoke(): Promise<string> {
    logger.info('Fetching random Chuck Norris joke');

    try {
      const response = await axios.get<ChuckNorrisJoke>(this.apiUrl);

      if (!response.data || !response.data.value) {
        logger.error('Invalid response from Chuck Norris API');
        throw new ExternalApiError('Respuesta inválida de la API');
      }

      const joke = response.data.value;
      logger.debug(`Chuck Norris joke fetched: ${joke.substring(0, 50)}...`);
      return joke;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }

      logger.error('Error fetching Chuck Norris joke', { error });
      throw new ExternalApiError('Error obteniendo chiste de Chuck Norris');
    }
  }
}

export const chuckNorrisService = new ChuckNorrisService();
