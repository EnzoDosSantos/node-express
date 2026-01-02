import { Request, Response, NextFunction } from 'express';
import { MathController } from '../../../src/controllers/math.controller';
import { MathService } from '../../../src/services/math.service';

jest.mock('../../../src/services/math.service');

describe('MathController', () => {
  let controller: MathController;
  let mockMathService: jest.Mocked<MathService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockMathService = new MathService() as jest.Mocked<MathService>;
    controller = new MathController(mockMathService);
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    
    mockNext = jest.fn();
  });

  describe('calculateLcm', () => {
    it('should calculate LCM and return correct response', async () => {
      mockRequest = {
        query: { numbers: '4,6' },
      };
      mockMathService.calculateLcm = jest.fn().mockReturnValue(12);

      await controller.calculateLcm(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockMathService.calculateLcm).toHaveBeenCalledWith([4, 6]);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          numbers: [4, 6],
          lcm: 12,
        },
      });
    });

    it('should call next with error if numbers is missing', async () => {
      mockRequest = {
        query: {},
      };

      await controller.calculateLcm(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('increment', () => {
    it('should increment number and return correct response', async () => {
      mockRequest = {
        query: { number: '5' },
      };
      mockMathService.increment = jest.fn().mockReturnValue(6);

      await controller.increment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockMathService.increment).toHaveBeenCalledWith(5);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          original: 5,
          result: 6,
        },
      });
    });

    it('should call next with error if number is missing', async () => {
      mockRequest = {
        query: {},
      };

      await controller.increment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
