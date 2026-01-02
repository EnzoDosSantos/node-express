import { ValidationError } from '../types';
import logger from '../utils/logger';

export class MathService {
  /**
   * Calculates Greatest Common Divisor using Euclidean algorithm
   */
  calculateGcd(a: number, b: number): number {
    logger.debug(`Calculating GCD of ${a} and ${b}`);
    if (b === 0) {
      return a;
    }
    return this.calculateGcd(b, a % b);
  }

  private calculateLcmOfTwo(a: number, b: number): number {
    return Math.abs(a * b) / this.calculateGcd(a, b);
  }

  /**
   * Calculates Least Common Multiple of an array of positive integers
   */
  calculateLcm(numbers: number[]): number {
    logger.info(`Calculating LCM of: [${numbers.join(', ')}]`);

    if (!numbers || numbers.length === 0) {
      logger.error('Attempted to calculate LCM with empty array');
      throw new ValidationError('Se requiere al menos un número');
    }

    for (const num of numbers) {
      if (!Number.isInteger(num) || num <= 0) {
        logger.error(`Invalid number detected: ${num}`);
        throw new ValidationError('Todos los números deben ser enteros positivos');
      }
    }

    if (numbers.length === 1) {
      return numbers[0];
    }

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result = this.calculateLcmOfTwo(result, numbers[i]);
    }

    logger.info(`LCM calculated: ${result}`);
    return result;
  }

  /**
   * Increments a number by 1
   */
  increment(number: number): number {
    logger.info(`Incrementing number: ${number}`);

    if (!Number.isFinite(number)) {
      logger.error(`Invalid number for increment: ${number}`);
      throw new ValidationError('Se requiere un número válido');
    }

    const result = number + 1;
    logger.info(`Increment result: ${result}`);
    return result;
  }
}

export const mathService = new MathService();
