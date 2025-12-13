import UserRepository, {
  type User,
  type UpdateUserInput,
} from "../repositories/user-repository";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get user by ID
   * Returns basic user information without relations
   */
  async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.getById(userId);
  }

  /**
   * Update user profile
   * Only allows updating name, bio, and image
   */
  async updateUserProfile(
    userId: string,
    data: UpdateUserInput
  ): Promise<User> {
    // Validate that we only update allowed fields
    const allowedFields = ["name", "bio", "image"] as const;
    const allowedData: UpdateUserInput = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        allowedFields.includes(key as (typeof allowedFields)[number])
      )
    ) as UpdateUserInput;

    return await this.userRepository.update(userId, allowedData);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.userRepository.getBy({ email });
    return users.length > 0 ? users[0] : null;
  }
}

export default UserService;
