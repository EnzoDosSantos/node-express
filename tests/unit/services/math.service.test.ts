import { MathService } from '../../../src/services/math.service';

describe('MathService', () => {
  let mathService: MathService;

  beforeEach(() => {
    mathService = new MathService();
  });

  describe('calculateLcm', () => {
    it('should calculate LCM of two numbers', () => {
      const result = mathService.calculateLcm([4, 6]);
      expect(result).toBe(12);
    });

    it('should calculate LCM of three numbers', () => {
      const result = mathService.calculateLcm([2, 3, 4]);
      expect(result).toBe(12);
    });

    it('should calculate LCM of multiple numbers', () => {
      const result = mathService.calculateLcm([2, 3, 4, 5]);
      expect(result).toBe(60);
    });

    it('should return the same number if only one element', () => {
      const result = mathService.calculateLcm([7]);
      expect(result).toBe(7);
    });

    it('should handle prime numbers', () => {
      const result = mathService.calculateLcm([3, 5, 7]);
      expect(result).toBe(105);
    });

    it('should handle equal numbers', () => {
      const result = mathService.calculateLcm([5, 5, 5]);
      expect(result).toBe(5);
    });

    it('should handle 1 correctly', () => {
      const result = mathService.calculateLcm([1, 2, 3]);
      expect(result).toBe(6);
    });

    it('should throw error if array is empty', () => {
      expect(() => mathService.calculateLcm([])).toThrow('Se requiere al menos un número');
    });

    it('should throw error if there are negative numbers', () => {
      expect(() => mathService.calculateLcm([4, -2])).toThrow('Todos los números deben ser enteros positivos');
    });

    it('should throw error if there are non-integer numbers', () => {
      expect(() => mathService.calculateLcm([4.5, 2])).toThrow('Todos los números deben ser enteros positivos');
    });

    it('should throw error if there are zeros', () => {
      expect(() => mathService.calculateLcm([0, 2])).toThrow('Todos los números deben ser enteros positivos');
    });
  });

  describe('increment', () => {
    it('should increment a positive number', () => {
      const result = mathService.increment(5);
      expect(result).toBe(6);
    });

    it('should increment zero', () => {
      const result = mathService.increment(0);
      expect(result).toBe(1);
    });

    it('should increment a negative number', () => {
      const result = mathService.increment(-1);
      expect(result).toBe(0);
    });

    it('should handle large numbers', () => {
      const result = mathService.increment(999999);
      expect(result).toBe(1000000);
    });

    it('should throw error if not a valid number', () => {
      expect(() => mathService.increment(NaN)).toThrow('Se requiere un número válido');
    });

    it('should throw error for Infinity', () => {
      expect(() => mathService.increment(Infinity)).toThrow('Se requiere un número válido');
    });
  });

  describe('calculateGcd', () => {
    it('should calculate GCD of two numbers', () => {
      const result = mathService.calculateGcd(12, 18);
      expect(result).toBe(6);
    });

    it('should return the larger number if one is 0', () => {
      const result = mathService.calculateGcd(12, 0);
      expect(result).toBe(12);
    });

    it('should handle coprime numbers', () => {
      const result = mathService.calculateGcd(7, 11);
      expect(result).toBe(1);
    });
  });
});
