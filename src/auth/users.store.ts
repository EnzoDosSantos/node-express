import bcrypt from 'bcryptjs';
import { User } from './types';

class UsersStore {
  private users: Map<string, User> = new Map();

  constructor() {
    this.seedMockUsers();
  }

  private async seedMockUsers(): Promise<void> {
    const mockUsers: Omit<User, 'id' | 'createdAt'>[] = [
      { name: 'Admin User', email: 'admin@test.com', password: 'admin123', role: 'admin', provider: 'local' },
      { name: 'Regular User', email: 'user@test.com', password: 'user123', role: 'user', provider: 'local' },
    ];

    for (const userData of mockUsers) {
      const hashedPassword = await bcrypt.hash(userData.password!, 10);
      const user: User = {
        id: crypto.randomUUID(),
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
      };
      this.users.set(user.email, user);
    }
  }

  findByEmail(email: string): User | undefined {
    return this.users.get(email);
  }

  findById(id: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.id === id);
  }

  create(userData: Omit<User, 'id' | 'createdAt'>): User {
    const user: User = {
      id: crypto.randomUUID(),
      ...userData,
      createdAt: new Date(),
    };
    this.users.set(user.email, user);
    return user;
  }

  findOrCreateOAuthUser(profile: { email: string; name: string; provider: 'google' }): User {
    let user = this.findByEmail(profile.email);
    
    if (!user) {
      user = this.create({
        name: profile.name,
        email: profile.email,
        role: 'user',
        provider: profile.provider,
      });
    }
    
    return user;
  }

  getAll(): User[] {
    return Array.from(this.users.values());
  }
}

export const usersStore = new UsersStore();

