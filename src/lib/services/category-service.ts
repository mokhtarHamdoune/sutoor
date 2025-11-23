import CategoryRepository, {
  Category,
  CreateCategoryInput,
} from "../repositories/category-repository";

export class CategoryService {
  constructor(private categoryRepo = new CategoryRepository()) {}

  /**
   * Create a new category
   */
  async create(input: CreateCategoryInput): Promise<Category> {
    // We could add validation here if needed
    return this.categoryRepo.save(input);
  }

  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    return this.categoryRepo.getBy({});
  }

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category | null> {
    return this.categoryRepo.getById(id);
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<Category | null> {
    return this.categoryRepo.getBySlug(slug);
  }

  /**
   * Update a category
   */
  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepo.getById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return this.categoryRepo.update(id, updates);
  }

  /**
   * Delete a category
   */
  async delete(id: string): Promise<void> {
    const category = await this.categoryRepo.getById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return this.categoryRepo.delete(id);
  }
}

// Singleton instance
export const categoryService = new CategoryService();

// Default export for convenience and tests
export default categoryService;
