import { Response, NextFunction } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../../src/auth/middleware/authenticate';
import { jwtService } from '../../../src/auth/jwt.service';
import { User } from '../../../src/auth/types';

describe('Auth Middleware', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockUser: User = {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    provider: 'local',
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockReq = { headers: { authorization: undefined } } as Partial<AuthenticatedRequest>;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('authenticate', () => {
    it('should call next() with valid token', () => {
      const token = jwtService.generateToken(mockUser);
      mockReq.headers = { authorization: `Bearer ${token}` };

      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.jwtPayload).toBeDefined();
      expect(mockReq.jwtPayload?.email).toBe(mockUser.email);
    });

    it('should return 401 when no token provided', () => {
      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token',
      });
    });

    it('should return 401 for invalid token', () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };

      authenticate(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token',
      });
    });
  });

  describe('authorize', () => {
    it('should call next() when user has required role', () => {
      mockReq.jwtPayload = { sub: 'test-id', name: 'Test', email: 'test@test.com', role: 'admin', iat: 0, exp: 0 };

      authorize('admin')(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user lacks required role', () => {
      mockReq.jwtPayload = { sub: 'test-id', name: 'Test', email: 'test@test.com', role: 'user', iat: 0, exp: 0 };

      authorize('admin')(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token',
      });
    });

    it('should return 401 when user is not authenticated', () => {
      authorize('user')(mockReq as AuthenticatedRequest, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });
});

