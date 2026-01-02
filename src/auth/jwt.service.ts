import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { User, JwtPayload } from './types';
import logger from '../utils/logger';

class JwtService {
  generateToken(user: User): string {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, authConfig.jwt.secret, {
      expiresIn: authConfig.jwt.expiresIn as jwt.SignOptions['expiresIn'],
      issuer: authConfig.jwt.issuer,
      audience: authConfig.jwt.audience,
    });

    logger.info(`JWT generated for user: ${user.email}`);
    return token;
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, authConfig.jwt.secret, {
        issuer: authConfig.jwt.issuer,
        audience: authConfig.jwt.audience,
      }) as JwtPayload;
      
      return decoded;
    } catch (error) {
      logger.warn(`JWT verification failed: ${(error as Error).message}`);
      return null;
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }
}

export const jwtService = new JwtService();

