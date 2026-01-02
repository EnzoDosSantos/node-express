import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { jwtService } from './jwt.service';
import { usersStore } from './users.store';
import { AuthenticatedRequest } from './middleware/authenticate';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
      }

      const result = await authService.login({ email, password });
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  }

  handleOAuthCallback(provider: 'google') {
    return (req: Request, res: Response): void => {
      const user = req.user as any;
      
      if (!user) {
        res.status(401).json({ success: false, error: 'OAuth authentication failed' });
        return;
      }

      const token = jwtService.generateToken(user);
      
      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            provider,
          },
        },
      });
    };
  }

  getProfile(req: AuthenticatedRequest, res: Response): void {
    if (!req.jwtPayload) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = usersStore.findById(req.jwtPayload.sub);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
  }
}

export const authController = new AuthController();

