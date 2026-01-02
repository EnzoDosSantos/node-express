import { authService } from '../../../src/auth/auth.service';
import { usersStore } from '../../../src/auth/users.store';

describe('AuthService', () => {
  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('login', () => {
    it('should return token and user for valid credentials', async () => {
      const result = await authService.login({
        email: 'admin@test.com',
        password: 'admin123',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('admin@test.com');
      expect(result.user.role).toBe('admin');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for invalid email', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@test.com',
          password: 'password',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      await expect(
        authService.login({
          email: 'admin@test.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('handleOAuthLogin', () => {
    it('should create user and return token for new OAuth user', () => {
      const result = authService.handleOAuthLogin({
        email: 'oauth@google.com',
        name: 'OAuth User',
        provider: 'google',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('oauth@google.com');
      expect(result.user.role).toBe('user');
    });

    it('should return existing user for returning OAuth user', () => {
      authService.handleOAuthLogin({
        email: 'returning@google.com',
        name: 'Returning User',
        provider: 'google',
      });

      const result = authService.handleOAuthLogin({
        email: 'returning@google.com',
        name: 'Returning User',
        provider: 'google',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('returning@google.com');
    });
  });
});

