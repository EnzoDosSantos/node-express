import { ChuckNorrisService, chuckNorrisService } from './chuckNorris.service';
import { DadJokeService, dadJokeService } from './dadJoke.service';
import { PairedJoke, ExternalApiError } from '../types';
import logger from '../utils/logger';

const JOKES_COUNT = 5;

export class PairedJokesService {
  private chuckService: ChuckNorrisService;
  private dadService: DadJokeService;

  constructor(
    chuckService: ChuckNorrisService = chuckNorrisService,
    dadService: DadJokeService = dadJokeService
  ) {
    this.chuckService = chuckService;
    this.dadService = dadService;
  }

  /**
   * Fetches 5 pairs of jokes in parallel from both APIs
   */
  async getPairedJokes(): Promise<PairedJoke[]> {
    logger.info(`Starting parallel fetch of ${JOKES_COUNT} joke pairs`);

    const chuckPromises: Promise<string | null>[] = [];
    const dadPromises: Promise<string | null>[] = [];

    for (let i = 0; i < JOKES_COUNT; i++) {
      chuckPromises.push(
        this.chuckService.getRandomJoke().catch((error) => {
          logger.warn(`Error fetching Chuck joke #${i + 1}: ${error.message}`);
          return null;
        })
      );
      dadPromises.push(
        this.dadService.getRandomJoke().catch((error) => {
          logger.warn(`Error fetching Dad Joke #${i + 1}: ${error.message}`);
          return null;
        })
      );
    }

    logger.info('Executing parallel requests...');
    const [chuckResults, dadResults] = await Promise.all([
      Promise.all(chuckPromises),
      Promise.all(dadPromises),
    ]);

    const chuckJokes = chuckResults.filter((joke): joke is string => joke !== null);
    const dadJokes = dadResults.filter((joke): joke is string => joke !== null);

    logger.info(`Jokes fetched: ${chuckJokes.length} Chuck, ${dadJokes.length} Dad`);

    if (chuckJokes.length === 0 || dadJokes.length === 0) {
      logger.error('Could not fetch enough jokes');
      throw new ExternalApiError('No se pudieron obtener chistes de las APIs externas');
    }

    const pairedJokes = this.pairJokes(chuckJokes, dadJokes);
    logger.info(`Total pairs created: ${pairedJokes.length}`);

    return pairedJokes;
  }

  /**
   * Pairs joke arrays 1 to 1
   */
  pairJokes(chuckJokes: string[], dadJokes: string[]): PairedJoke[] {
    const minLength = Math.min(chuckJokes.length, dadJokes.length);
    logger.debug(`Pairing ${minLength} jokes`);

    const paired: PairedJoke[] = [];

    for (let i = 0; i < minLength; i++) {
      paired.push({
        chuck: chuckJokes[i],
        dad: dadJokes[i],
        combinado: this.combineJokes(chuckJokes[i], dadJokes[i]),
      });
    }

    return paired;
  }

  /**
   * Creatively combines two jokes
   */
  combineJokes(chuck: string, dad: string): string {
    const chuckFirst = this.getFirstSentence(chuck);
    const dadPunchline = this.getPunchline(dad);

    const combinedOptions = [
      `${chuckFirst} Meanwhile, ${dadPunchline.toLowerCase()}`,
      `${chuckFirst} Speaking of which, ${dadPunchline.toLowerCase()}`,
      `${chuckFirst} Also, ${dadPunchline.toLowerCase()}`,
      `Legend says that ${chuckFirst.toLowerCase()} And that's why ${dadPunchline.toLowerCase()}`,
    ];

    const index = (chuck.length + dad.length) % combinedOptions.length;
    return combinedOptions[index];
  }

  private getFirstSentence(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      return sentences[0].trim();
    }
    return text;
  }

  private getPunchline(text: string): string {
    const parts = text.split(/[?]/);
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    
    const sentences = text.match(/[^.!?]+[.!?]*/g);
    if (sentences && sentences.length > 1) {
      return sentences[sentences.length - 1].trim();
    }
    
    return text;
  }
}

export const pairedJokesService = new PairedJokesService();
