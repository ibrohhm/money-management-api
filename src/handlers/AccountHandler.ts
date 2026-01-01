import { Request, Response } from 'express';
import { AccountService } from '../services/AccountService';
import { ApiResponse } from '../types/response';
import { Account } from '../models/Account';

export class AccountHandler {
  private service: AccountService;

  constructor() {
    this.service = new AccountService();
  }

  private validateAccountInput(data: any): { valid: boolean; error?: string } {
    const { name } = data;

    // Validate required fields
    if (!name) {
      return {
        valid: false,
        error: 'Missing required field: name is required'
      };
    }

    return { valid: true };
  }

  getAllAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const accounts = await this.service.getAllAccounts();
      const response: ApiResponse<Account[]> = {
        success: true,
        data: accounts,
        count: accounts.length
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch accounts'
      });
    }
  };

  getAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const account = await this.service.getAccountById(id);

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }

      const response: ApiResponse<Account> = {
        success: true,
        data: account
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch account'
      });
    }
  };

  createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = this.validateAccountInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const account = await this.service.createAccount(req.body);
      const response: ApiResponse<Account> = {
        success: true,
        data: account
      };
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  updateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const validation = this.validateAccountInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const account = await this.service.updateAccount(id, req.body);

      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }

      const response: ApiResponse<Account> = {
        success: true,
        data: account
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update account';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.service.deleteAccount(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete account'
      });
    }
  };
}
