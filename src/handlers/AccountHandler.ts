import { Request, Response } from 'express';
import { AccountService } from '../services/AccountService';
import { ApiResponse } from '../types/response';
import { Account } from '../models/Account';
import { DEFAULT_USER_ID } from '../models/User';

export class AccountHandler {
  private service: AccountService;

  constructor() {
    this.service = new AccountService();
  }

  private validateAccountInput(data: any): { valid: boolean; error?: string } {
    const { name, account_group_id } = data;

    if (!name) {
      return {
        valid: false,
        error: 'Missing required field: name is required'
      };
    }

    if (!account_group_id) {
      return {
        valid: false,
        error: 'Missing required field: account_group_id is required'
      };
    }

    return { valid: true };
  }

  getAllAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const accounts = await this.service.getAllAccounts(DEFAULT_USER_ID);
      const response: ApiResponse<Account[]> = {
        success: true,
        data: accounts,
        count: accounts.length
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch accounts';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  getAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const account = await this.service.getAccountById(id, DEFAULT_USER_ID);

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch account';

      res.status(500).json({
        success: false,
        message: errorMessage
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

      const accountData: Omit<Account, 'id'> = {
        ...req.body,
        user_id: DEFAULT_USER_ID
      };

      const account = await this.service.createAccount(accountData);
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
      const id = Number(req.params.id);

      const validation = this.validateAccountInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const accountData: Account = {
        ...req.body,
        id,
        user_id: DEFAULT_USER_ID
      };

      const account = await this.service.updateAccount(id, accountData);

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
      const id = Number(req.params.id);
      const deleted = await this.service.deleteAccount(id, DEFAULT_USER_ID);

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };
}
