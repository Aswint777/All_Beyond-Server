import { UserRepository } from "../interfaces/UserRepository"
import { LoginDTO } from "..//dtos/LoginDTO"

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: LoginDTO): Promise<string> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || user.password !== data.password) {
      throw new Error("Invalid credentials");
    }
    // Generate token (JWT logic could be in the infrastructure layer)
    return "mocked-jwt-token"; // Replace with real token generation
  }
}