import { Request, Response } from 'express';
import { AccountGroupService } from '../services/AccountGroupService';
import { ApiResponse } from '../types/response';
import { AccountGroup } from '../models/AccountGroup';
import { DEFAULT_USER_ID } from '../models/User';

export class AccountGroupHandler {
  private service: AccountGroupService;

  constructor() {
    this.service = new AccountGroupService();
  }

  private validateInput(data: any): { valid: boolean; error?: string } {
    const { name } = data;

    if (!name) {
      return {
        valid: false,
        error: 'Missing required field: name is required'
      };
    }

    return { valid: true };
  }

  getAllAccountGroups = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountGroups = await this.service.getAllAccountGroups(DEFAULT_USER_ID);
      const response: ApiResponse<AccountGroup[]> = {
        success: true,
        data: accountGroups,
        count: accountGroups.length
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch account groups';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  getAccountGroupById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const accountGroup = await this.service.getAccountGroupById(id, DEFAULT_USER_ID);

      if (!accountGroup) {
        res.status(404).json({
          success: false,
          message: 'Account group not found'
        });
        return;
      }

      const response: ApiResponse<AccountGroup> = {
        success: true,
        data: accountGroup
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch account group';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  createAccountGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = this.validateInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const data: Omit<AccountGroup, 'id'> = {
        ...req.body,
        user_id: DEFAULT_USER_ID
      };

      const accountGroup = await this.service.createAccountGroup(data);
      const response: ApiResponse<AccountGroup> = {
        success: true,
        data: accountGroup
      };
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account group';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  updateAccountGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const validation = this.validateInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const data: AccountGroup = {
        ...req.body,
        id,
        user_id: DEFAULT_USER_ID
      };

      const accountGroup = await this.service.updateAccountGroup(id, data);

      if (!accountGroup) {
        res.status(404).json({
          success: false,
          message: 'Account group not found'
        });
        return;
      }

      const response: ApiResponse<AccountGroup> = {
        success: true,
        data: accountGroup
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update account group';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  deleteAccountGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.service.deleteAccountGroup(id, DEFAULT_USER_ID);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Account group not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Account group deleted successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account group';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };
}
