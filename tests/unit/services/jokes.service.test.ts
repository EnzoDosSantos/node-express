import { JokesService } from '../../../src/services/jokes.service';
import { Joke, JokeCreateDTO, JokeUpdateDTO } from '../../../src/types';

const mockJokeRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByUserId: jest.fn(),
  findByCategoryId: jest.fn(),
  findByUserAndCategory: jest.fn(),
};

describe('JokesService', () => {
  let jokesService: JokesService;

  beforeEach(() => {
    jest.clearAllMocks();
    jokesService = new JokesService(mockJokeRepository as any);
  });

  describe('getAllJokes', () => {
    it('should return all jokes', async () => {
      const mockJokes: Joke[] = [
        { id: 1, text: 'Joke 1' },
        { id: 2, text: 'Joke 2' },
      ];
      mockJokeRepository.findAll.mockResolvedValue(mockJokes);

      const result = await jokesService.getAllJokes();

      expect(result).toEqual(mockJokes);
      expect(mockJokeRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if no jokes exist', async () => {
      mockJokeRepository.findAll.mockResolvedValue([]);

      const result = await jokesService.getAllJokes();

      expect(result).toEqual([]);
    });
  });

  describe('getJokeById', () => {
    it('should return a joke by its ID', async () => {
      const mockJoke: Joke = { id: 1, text: 'Test joke' };
      mockJokeRepository.findById.mockResolvedValue(mockJoke);

      const result = await jokesService.getJokeById(1);

      expect(result).toEqual(mockJoke);
      expect(mockJokeRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw error if joke does not exist', async () => {
      mockJokeRepository.findById.mockResolvedValue(null);

      await expect(jokesService.getJokeById(999)).rejects.toThrow('Chiste no encontrado');
    });

    it('should throw error if ID is invalid', async () => {
      await expect(jokesService.getJokeById(-1)).rejects.toThrow('ID inválido');
      await expect(jokesService.getJokeById(0)).rejects.toThrow('ID inválido');
    });
  });

  describe('createJoke', () => {
    it('should create a new joke', async () => {
      const jokeData: JokeCreateDTO = { text: 'New joke' };
      const createdJoke: Joke = { id: 1, text: 'New joke' };
      mockJokeRepository.create.mockResolvedValue(createdJoke);

      const result = await jokesService.createJoke(jokeData);

      expect(result).toEqual(createdJoke);
      expect(mockJokeRepository.create).toHaveBeenCalledWith(jokeData);
    });

    it('should throw error if text is empty', async () => {
      const jokeData: JokeCreateDTO = { text: '' };

      await expect(jokesService.createJoke(jokeData)).rejects.toThrow('El texto del chiste es requerido');
    });

    it('should throw error if text contains only spaces', async () => {
      const jokeData: JokeCreateDTO = { text: '   ' };

      await expect(jokesService.createJoke(jokeData)).rejects.toThrow('El texto del chiste es requerido');
    });
  });

  describe('updateJoke', () => {
    it('should update an existing joke', async () => {
      const existingJoke: Joke = { id: 1, text: 'Original joke' };
      const updateData: JokeUpdateDTO = { text: 'Updated joke' };
      const updatedJoke: Joke = { id: 1, text: 'Updated joke' };

      mockJokeRepository.findById.mockResolvedValue(existingJoke);
      mockJokeRepository.update.mockResolvedValue(updatedJoke);

      const result = await jokesService.updateJoke(1, updateData);

      expect(result).toEqual(updatedJoke);
      expect(mockJokeRepository.update).toHaveBeenCalledWith(1, updateData);
    });

    it('should throw error if joke does not exist', async () => {
      mockJokeRepository.findById.mockResolvedValue(null);

      await expect(jokesService.updateJoke(999, { text: 'New' })).rejects.toThrow('Chiste no encontrado');
    });

    it('should throw error if new text is empty', async () => {
      const existingJoke: Joke = { id: 1, text: 'Original joke' };
      mockJokeRepository.findById.mockResolvedValue(existingJoke);

      await expect(jokesService.updateJoke(1, { text: '' })).rejects.toThrow('El texto del chiste es requerido');
    });
  });

  describe('deleteJoke', () => {
    it('should delete an existing joke', async () => {
      const existingJoke: Joke = { id: 1, text: 'Joke to delete' };
      mockJokeRepository.findById.mockResolvedValue(existingJoke);
      mockJokeRepository.delete.mockResolvedValue(true);

      const result = await jokesService.deleteJoke(1);

      expect(result).toBe(true);
      expect(mockJokeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if joke does not exist', async () => {
      mockJokeRepository.findById.mockResolvedValue(null);

      await expect(jokesService.deleteJoke(999)).rejects.toThrow('Chiste no encontrado');
    });

    it('should throw error if ID is invalid', async () => {
      await expect(jokesService.deleteJoke(-1)).rejects.toThrow('ID inválido');
    });
  });

  describe('getJokesByUserId', () => {
    it('should return jokes for a specific user', async () => {
      const mockJokes: Joke[] = [
        { id: 1, text: 'User joke 1', userId: 1 },
        { id: 2, text: 'User joke 2', userId: 1 },
      ];
      mockJokeRepository.findByUserId.mockResolvedValue(mockJokes);

      const result = await jokesService.getJokesByUserId(1);

      expect(result).toEqual(mockJokes);
      expect(mockJokeRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('getJokesByCategoryId', () => {
    it('should return jokes for a specific category', async () => {
      const mockJokes: Joke[] = [
        { id: 1, text: 'Category joke', categoryId: 1 },
      ];
      mockJokeRepository.findByCategoryId.mockResolvedValue(mockJokes);

      const result = await jokesService.getJokesByCategoryId(1);

      expect(result).toEqual(mockJokes);
      expect(mockJokeRepository.findByCategoryId).toHaveBeenCalledWith(1);
    });
  });

  describe('getJokesByUserAndCategory', () => {
    it('should return jokes filtered by user and category', async () => {
      const mockJokes: Joke[] = [
        { id: 1, text: 'Filtered joke', userId: 1, categoryId: 1 },
      ];
      mockJokeRepository.findByUserAndCategory.mockResolvedValue(mockJokes);

      const result = await jokesService.getJokesByUserAndCategory(1, 1);

      expect(result).toEqual(mockJokes);
      expect(mockJokeRepository.findByUserAndCategory).toHaveBeenCalledWith(1, 1);
    });
  });
});
