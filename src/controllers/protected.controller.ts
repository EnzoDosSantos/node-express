import { Response } from 'express';
import { AuthenticatedRequest } from '../auth/middleware/authenticate';

class ProtectedController {
  getUserData(req: AuthenticatedRequest, res: Response): void {
    res.json({
      success: true,
      data: {
        message: 'Welcome to the user area',
        user: req.jwtPayload,
        timestamp: new Date().toISOString(),
      },
    });
  }

  getAdminData(req: AuthenticatedRequest, res: Response): void {
    res.json({
      success: true,
      data: {
        message: 'Welcome to the admin area',
        user: req.jwtPayload,
        permissions: ['read', 'write', 'delete', 'manage_users'],
        timestamp: new Date().toISOString(),
      },
    });
  }
}

export const protectedController = new ProtectedController();

