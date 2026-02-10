import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { ApiResponse } from '../types/response';
import { Category, CATEGORY_TYPES } from '../models/Category';
import { DEFAULT_USER_ID } from '../models/User';

export class CategoryHandler {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  private validateCategoryInput(data: any): { valid: boolean; error?: string } {
    const { name, type } = data;

    if (!name || !type) {
      return {
        valid: false,
        error: 'Missing required fields: name and type are required'
      };
    }

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

      if (type && type !== 'income' && type !== 'expense') {
        res.status(422).json({
          success: false,
          message: 'Invalid type parameter. Must be either "income" or "expense"'
        });
        return;
      }

      const typeFilter = type ? String(type) : undefined;
      const categories = await this.service.getAllCategories(DEFAULT_USER_ID, typeFilter);
      const response: ApiResponse<Category[]> = {
        success: true,
        data: categories,
        count: categories.length
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const category = await this.service.getCategoryById(id, DEFAULT_USER_ID);

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category';

      res.status(500).json({
        success: false,
        message: errorMessage
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

      const { name, type, parent_id } = req.body;
      const category = await this.service.createCategory({
        name,
        category_type: CATEGORY_TYPES[type],
        parent_id: parent_id || null,
        user_id: DEFAULT_USER_ID
      });

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
      const id = Number(req.params.id);

      const validation = this.validateCategoryInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const { name, type, parent_id } = req.body;
      const category = await this.service.updateCategory(id, {
        name,
        category_type: CATEGORY_TYPES[type],
        parent_id: parent_id || null,
        user_id: DEFAULT_USER_ID
      });

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
      const id = Number(req.params.id);
      const deleted = await this.service.deleteCategory(id, DEFAULT_USER_ID);

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete category';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };
}
