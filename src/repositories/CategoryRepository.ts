import categoriesData from '../data/categories.json'
import { Category } from '../models/Category'

export class CategoryRepository {
  private categories: Category[] = categoriesData as Category[];

  async findAll(): Promise<Category[]> {
    return this.categories
  }

  async findById(id: string): Promise<Category | null> {
    const category = this.categories.find(t => t.id === id);
    return category || null;
  }

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = {
      id: String(this.categories.length + 1),
      ...category
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async update(id: string, category: Partial<Category>): Promise<Category | null> {
    const index = this.categories.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.categories[index] = { ...this.categories[index], ...category };
    return this.categories[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.categories.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.categories.splice(index, 1);
    return true;
  }
}
