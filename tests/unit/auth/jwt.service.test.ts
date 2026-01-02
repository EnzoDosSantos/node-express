import { jwtService } from '../../../src/auth/jwt.service';
import { User } from '../../../src/auth/types';

describe('JwtService', () => {
  const mockUser: User = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    provider: 'local',
    createdAt: new Date(),
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = jwtService.generateToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const token = jwtService.generateToken(mockUser);
      const payload = jwtService.verifyToken(token);

      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe(mockUser.id);
      expect(payload?.name).toBe(mockUser.name);
      expect(payload?.email).toBe(mockUser.email);
      expect(payload?.role).toBe(mockUser.role);
    });

    it('should return null for invalid token', () => {
      const payload = jwtService.verifyToken('invalid-token');
      expect(payload).toBeNull();
    });

    it('should return null for tampered token', () => {
      const token = jwtService.generateToken(mockUser);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      
      const payload = jwtService.verifyToken(tamperedToken);
      expect(payload).toBeNull();
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const token = jwtService.generateToken(mockUser);
      const decoded = jwtService.decodeToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.email).toBe(mockUser.email);
    });
  });
});

