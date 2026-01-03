import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { ApiResponse } from '../types/response';
import { Category } from '../models/Category';

export class CategoryHandler {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  private validateCategoryInput(data: any): { valid: boolean; error?: string } {
    const { name, type } = data;

    // Validate required fields
    if (!name || !type) {
      return {
        valid: false,
        error: 'Missing required fields: name and type are required'
      };
    }

    // Validate type
    if (type !== 'income' && type !== 'expense') {
      return {
        valid: false,
        error: 'Invalid type. Must be either "income" or "expense"'
      };
    }

    return { valid: true };
  }

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.query;

      // Validate type parameter if provided
      if (type && type !== 'income' && type !== 'expense') {
        res.status(422).json({
          success: false,
          message: 'Invalid type parameter. Must be either "income" or "expense"'
        });
        return;
      }

      const categories = await this.service.getAllCategories(type);
      const response: ApiResponse<Category[]> = {
        success: true,
        data: categories,
        count: categories.length
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories'
      });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const category = await this.service.getCategoryById(id);

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      const response: ApiResponse<Category> = {
        success: true,
        data: category
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category'
      });
    }
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = this.validateCategoryInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const category = await this.service.createCategory(req.body);
      const response: ApiResponse<Category> = {
        success: true,
        data: category
      };
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const validation = this.validateCategoryInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const category = await this.service.updateCategory(id, req.body);

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      const response: ApiResponse<Category> = {
        success: true,
        data: category
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update category';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.service.deleteCategory(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Category not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete category'
      });
    }
  };
}
