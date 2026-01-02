import { Request, Response, NextFunction } from 'express';
import { MathService, mathService } from '../services/math.service';
import { ValidationError } from '../types';
import logger from '../utils/logger';

export class MathController {
  private mathService: MathService;

  constructor(mathServiceInstance: MathService = mathService) {
    this.mathService = mathServiceInstance;
  }

  calculateLcm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { numbers } = req.query;
      logger.info(`GET /math/lcm - numbers: ${numbers}`);

      if (!numbers || typeof numbers !== 'string') {
        throw new ValidationError('El query param "numbers" es requerido (ej: ?numbers=2,3,4)');
      }

      const numberArray = numbers.split(',').map((n: string) => {
        const parsed = parseInt(n.trim(), 10);
        if (isNaN(parsed)) {
          throw new ValidationError(`"${n.trim()}" no es un número válido`);
        }
        return parsed;
      });

      if (numberArray.length === 0) {
        throw new ValidationError('Se requiere al menos un número');
      }

      const lcm = this.mathService.calculateLcm(numberArray);

      res.json({
        success: true,
        data: {
          numbers: numberArray,
          lcm,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  increment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { number } = req.query;
      logger.info(`GET /math/increment - number: ${number}`);

      if (number === undefined || number === '') {
        throw new ValidationError('El query param "number" es requerido (ej: ?number=5)');
      }

      const parsedNumber = parseInt(number as string, 10);

      if (isNaN(parsedNumber)) {
        throw new ValidationError(`"${number}" no es un número válido`);
      }

      const result = this.mathService.increment(parsedNumber);

      res.json({
        success: true,
        data: {
          original: parsedNumber,
          result,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const mathController = new MathController();
