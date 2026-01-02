import { ChuckNorrisService } from '../../../src/services/chuckNorris.service';
import { DadJokeService } from '../../../src/services/dadJoke.service';
import { ExternalJokesService } from '../../../src/services/externalJokes.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ChuckNorrisService', () => {
  let chuckService: ChuckNorrisService;

  beforeEach(() => {
    jest.clearAllMocks();
    chuckService = new ChuckNorrisService();
  });

  describe('getRandomJoke', () => {
    it('should get a random Chuck Norris joke', async () => {
      const mockResponse = {
        data: {
          icon_url: 'https://example.com/icon.png',
          id: 'abc123',
          url: 'https://example.com/joke',
          value: 'Chuck Norris can divide by zero.',
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await chuckService.getRandomJoke();

      expect(result).toBe('Chuck Norris can divide by zero.');
      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/random');
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(chuckService.getRandomJoke()).rejects.toThrow('Error obteniendo chiste de Chuck Norris');
    });

    it('should handle empty responses', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });

      await expect(chuckService.getRandomJoke()).rejects.toThrow('Respuesta inválida de la API');
    });
  });
});

describe('DadJokeService', () => {
  let dadService: DadJokeService;

  beforeEach(() => {
    jest.clearAllMocks();
    dadService = new DadJokeService();
  });

  describe('getRandomJoke', () => {
    it('should get a random Dad Joke', async () => {
      const mockResponse = {
        data: {
          id: 'xyz789',
          joke: 'Why did the coffee file a police report? It got mugged.',
          status: 200,
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await dadService.getRandomJoke();

      expect(result).toBe('Why did the coffee file a police report? It got mugged.');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://icanhazdadjoke.com/',
        expect.objectContaining({
          headers: { Accept: 'application/json' },
        })
      );
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(dadService.getRandomJoke()).rejects.toThrow('Error obteniendo chiste de Dad Jokes');
    });

    it('should handle empty responses', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });

      await expect(dadService.getRandomJoke()).rejects.toThrow('Respuesta inválida de la API');
    });
  });
});

describe('ExternalJokesService', () => {
  let externalService: ExternalJokesService;

  beforeEach(() => {
    jest.clearAllMocks();
    externalService = new ExternalJokesService();
  });

  describe('getJokeBySource', () => {
    it('should get joke from Chuck Norris when source is "Chuck"', async () => {
      const mockResponse = {
        data: { value: 'Chuck Norris joke' },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await externalService.getJokeBySource('Chuck');

      expect(result).toBe('Chuck Norris joke');
    });

    it('should get joke from Dad Jokes when source is "Dad"', async () => {
      const mockResponse = {
        data: { joke: 'Dad joke' },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await externalService.getJokeBySource('Dad');

      expect(result).toBe('Dad joke');
    });

    it('should throw error for invalid source', async () => {
      await expect(externalService.getJokeBySource('Invalid' as any)).rejects.toThrow(
        'Fuente de chiste inválida. Use "Chuck" o "Dad"'
      );
    });
  });

  describe('getRandomJoke', () => {
    it('should get a random joke from any source', async () => {
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0);
      
      const mockChuckResponse = {
        data: { value: 'Random joke from Chuck' },
      };
      mockedAxios.get.mockResolvedValue(mockChuckResponse);

      const result = await externalService.getRandomJoke();

      expect(typeof result).toBe('string');
      expect(result).toBe('Random joke from Chuck');
      
      Math.random = originalRandom;
    });
  });
});
