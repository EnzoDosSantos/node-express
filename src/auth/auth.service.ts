import bcrypt from 'bcryptjs';
import { usersStore } from './users.store';
import { jwtService } from './jwt.service';
import { LoginRequest, AuthResponse, User } from './types';
import logger from '../utils/logger';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;
    
    const user = usersStore.findByEmail(email);
    if (!user || !user.password) {
      logger.warn(`Login failed: user not found - ${email}`);
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn(`Login failed: invalid password - ${email}`);
      throw new Error('Invalid credentials');
    }

    const token = jwtService.generateToken(user);
    logger.info(`User logged in successfully: ${email}`);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  handleOAuthLogin(profile: { email: string; name: string; provider: 'google' }): AuthResponse {
    const user = usersStore.findOrCreateOAuthUser(profile);
    const token = jwtService.generateToken(user);
    
    logger.info(`OAuth login successful: ${profile.email} via ${profile.provider}`);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();

