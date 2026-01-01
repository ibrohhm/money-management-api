import { Category  } from "../models/Category";
import { CategoryRepository } from "../repositories/CategoryRepository";

export class CategoryService {
  private repository: CategoryRepository;

  constructor() {
    this.repository = new CategoryRepository();
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.repository.findAll();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.repository.findById(id);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return await this.repository.create(category);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category | null> {
    return await this.repository.update(id, category)
  }

  async deleteCategory(id: string): Promise<boolean> {
    return await this.repository.delete(id)
  }
}
