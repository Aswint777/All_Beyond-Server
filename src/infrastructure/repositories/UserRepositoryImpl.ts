import { UserRepository } from "../../application/interfaces/UserRepository";
import { User } from "../../domain/entities/User"

export class UserRepositoryImpl implements UserRepository {
  private users = new Map<string, User>();

  constructor() {
    // Add mock data for testing
    this.users.set("test@example.com", new User("1", "test@example.com", "password123"));
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null;
  }
}    