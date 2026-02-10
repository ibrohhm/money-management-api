import { Category, CATEGORY_TYPES } from "../models/Category";
import { CategoryRepository } from "../repositories/CategoryRepository";

export class CategoryService {
  private repository: CategoryRepository;

  constructor() {
    this.repository = new CategoryRepository();
  }

  async getAllCategories(userId: number, type?: string): Promise<Category[]> {
    const categoryType = type ? CATEGORY_TYPES[type] : undefined;
    return await this.repository.findAll(userId, categoryType);
  }

  async getCategoryById(id: number, userId: number): Promise<Category | null> {
    return await this.repository.findById(id, userId);
  }

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return await this.repository.create(category);
  }

  async updateCategory(id: number, category: Category): Promise<Category | null> {
    return await this.repository.update(id, category);
  }

  async deleteCategory(id: number, userId: number): Promise<boolean> {
    return await this.repository.delete(id, userId);
  }
}
