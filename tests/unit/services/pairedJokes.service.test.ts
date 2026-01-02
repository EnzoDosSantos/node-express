import { PairedJokesService } from '../../../src/services/pairedJokes.service';
import { ChuckNorrisService } from '../../../src/services/chuckNorris.service';
import { DadJokeService } from '../../../src/services/dadJoke.service';
import { PairedJoke } from '../../../src/types';

jest.mock('../../../src/services/chuckNorris.service');
jest.mock('../../../src/services/dadJoke.service');

describe('PairedJokesService', () => {
  let pairedService: PairedJokesService;
  let mockChuckService: jest.Mocked<ChuckNorrisService>;
  let mockDadService: jest.Mocked<DadJokeService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockChuckService = new ChuckNorrisService() as jest.Mocked<ChuckNorrisService>;
    mockDadService = new DadJokeService() as jest.Mocked<DadJokeService>;
    pairedService = new PairedJokesService(mockChuckService, mockDadService);
  });

  describe('getPairedJokes', () => {
    it('should get 5 pairs of matched jokes', async () => {
      const chuckJokes = [
        'Chuck joke 1', 'Chuck joke 2', 'Chuck joke 3', 'Chuck joke 4', 'Chuck joke 5'
      ];
      const dadJokes = [
        'Dad joke 1', 'Dad joke 2', 'Dad joke 3', 'Dad joke 4', 'Dad joke 5'
      ];

      mockChuckService.getRandomJoke = jest.fn()
        .mockResolvedValueOnce(chuckJokes[0])
        .mockResolvedValueOnce(chuckJokes[1])
        .mockResolvedValueOnce(chuckJokes[2])
        .mockResolvedValueOnce(chuckJokes[3])
        .mockResolvedValueOnce(chuckJokes[4]);

      mockDadService.getRandomJoke = jest.fn()
        .mockResolvedValueOnce(dadJokes[0])
        .mockResolvedValueOnce(dadJokes[1])
        .mockResolvedValueOnce(dadJokes[2])
        .mockResolvedValueOnce(dadJokes[3])
        .mockResolvedValueOnce(dadJokes[4]);

      const result = await pairedService.getPairedJokes();

      expect(result).toHaveLength(5);
      expect(result[0].chuck).toBe('Chuck joke 1');
      expect(result[0].dad).toBe('Dad joke 1');
      expect(result[0].combinado).toBeDefined();
    });

    it('should execute requests in parallel', async () => {
      const chuckJoke = 'Chuck joke';
      const dadJoke = 'Dad joke';

      mockChuckService.getRandomJoke = jest.fn().mockResolvedValue(chuckJoke);
      mockDadService.getRandomJoke = jest.fn().mockResolvedValue(dadJoke);

      await pairedService.getPairedJokes();

      expect(mockChuckService.getRandomJoke).toHaveBeenCalledTimes(5);
      expect(mockDadService.getRandomJoke).toHaveBeenCalledTimes(5);
    });

    it('should handle partial errors and return successful pairs', async () => {
      mockChuckService.getRandomJoke = jest.fn()
        .mockResolvedValueOnce('Chuck joke 1')
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce('Chuck joke 3')
        .mockResolvedValueOnce('Chuck joke 4')
        .mockResolvedValueOnce('Chuck joke 5');

      mockDadService.getRandomJoke = jest.fn()
        .mockResolvedValue('Dad joke');

      const result = await pairedService.getPairedJokes();

      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('pairJokes', () => {
    it('should pair arrays of equal length', () => {
      const chuckJokes = ['Chuck 1', 'Chuck 2', 'Chuck 3'];
      const dadJokes = ['Dad 1', 'Dad 2', 'Dad 3'];

      const result = pairedService.pairJokes(chuckJokes, dadJokes);

      expect(result).toHaveLength(3);
      expect(result[0].chuck).toBe('Chuck 1');
      expect(result[0].dad).toBe('Dad 1');
      expect(result[1].chuck).toBe('Chuck 2');
      expect(result[1].dad).toBe('Dad 2');
    });

    it('should pair only up to the minimum of both arrays', () => {
      const chuckJokes = ['Chuck 1', 'Chuck 2'];
      const dadJokes = ['Dad 1', 'Dad 2', 'Dad 3', 'Dad 4'];

      const result = pairedService.pairJokes(chuckJokes, dadJokes);

      expect(result).toHaveLength(2);
    });

    it('should return empty array if any array is empty', () => {
      const result = pairedService.pairJokes([], ['Dad 1']);
      expect(result).toHaveLength(0);
    });

    it('should create the combined field correctly', () => {
      const chuckJokes = ['Chuck Norris counted to infinity.'];
      const dadJokes = ['Why did the math book look sad?'];

      const result = pairedService.pairJokes(chuckJokes, dadJokes);

      expect(result[0].combinado).toBeDefined();
      expect(typeof result[0].combinado).toBe('string');
      expect(result[0].combinado.length).toBeGreaterThan(0);
    });
  });

  describe('combineJokes', () => {
    it('should combine two jokes into one', () => {
      const chuck = 'Chuck Norris counted to infinity. Twice.';
      const dad = 'Why did the math book look sad? Because it had too many problems.';

      const result = pairedService.combineJokes(chuck, dad);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatch(/Chuck|math|infinity|problems|sad/i);
    });

    it('should handle short jokes', () => {
      const chuck = 'Short chuck.';
      const dad = 'Short dad.';

      const result = pairedService.combineJokes(chuck, dad);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle jokes with special characters', () => {
      const chuck = "Chuck's joke with 'quotes' and \"double quotes\"";
      const dad = "Dad's joke with special chars: !@#$%";

      const result = pairedService.combineJokes(chuck, dad);

      expect(typeof result).toBe('string');
    });
  });

  describe('error handling', () => {
    it('should throw error if all requests fail', async () => {
      mockChuckService.getRandomJoke = jest.fn().mockRejectedValue(new Error('API Error'));
      mockDadService.getRandomJoke = jest.fn().mockRejectedValue(new Error('API Error'));

      await expect(pairedService.getPairedJokes()).rejects.toThrow();
    });

    it('should continue if only some requests fail', async () => {
      mockChuckService.getRandomJoke = jest.fn()
        .mockResolvedValueOnce('Chuck joke')
        .mockRejectedValue(new Error('API Error'));

      mockDadService.getRandomJoke = jest.fn()
        .mockResolvedValueOnce('Dad joke')
        .mockRejectedValue(new Error('API Error'));

      const result = await pairedService.getPairedJokes();

      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });
});
