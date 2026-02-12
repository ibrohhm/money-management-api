import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { ApiResponse } from '../types/response';
import { TransactionResponse, TRANSACTION_TYPES, TransactionGroup } from '../models/Transaction';
import { DEFAULT_USER_ID } from '../models/User';

export class TransactionHandler {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  private validateTransactionInput(data: any): { valid: boolean; error?: string } {
    const { transaction_at, description, amount, category_id, account_id, transaction_type } = data;

    if (!transaction_at || !description || amount === undefined || !category_id || !account_id || !transaction_type) {
      return {
        valid: false,
        error: 'Missing required fields: transaction_at, description, amount, category_id, account_id, and transaction_type are required'
      };
    }

    if (transaction_type !== 'income' && transaction_type !== 'expense') {
      return {
        valid: false,
        error: 'Invalid transaction_type. Must be either "income" or "expense"'
      };
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      return {
        valid: false,
        error: 'Amount must be a valid number'
      };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/;
    if (!dateRegex.test(transaction_at)) {
      return {
        valid: false,
        error: 'Invalid date format. Expected YYYY-MM-DDTHH:MM:SS'
      };
    }

    return { valid: true };
  }

  getAllTransactionGroups = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactions = await this.service.getAllTransactions(DEFAULT_USER_ID);
      const transactionGroups = this.service.groupTransactionsByDate(transactions)
      const response: ApiResponse<TransactionGroup[]> = {
        success: true,
        data: transactionGroups,
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  getAllTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactions = await this.service.getAllTransactions(DEFAULT_USER_ID);
      const response: ApiResponse<TransactionResponse[]> = {
        success: true,
        data: transactions,
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  getTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const transaction = await this.service.getTransactionById(id, DEFAULT_USER_ID);

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
        return;
      }

      const response: ApiResponse<TransactionResponse> = {
        success: true,
        data: transaction
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transaction';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };

  createTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const validation = this.validateTransactionInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const { transaction_at, description, amount, category_id, account_id, transaction_type } = req.body;
      const transaction = await this.service.createTransaction({
        transaction_at,
        description,
        amount,
        user_id: DEFAULT_USER_ID,
        category_id,
        account_id,
        transaction_type: TRANSACTION_TYPES[transaction_type]
      });

      const response: ApiResponse<TransactionResponse> = {
        success: true,
        data: transaction
      };
      res.status(201).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
      const statusCode = (errorMessage === 'Category not found' || errorMessage === 'Account not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: errorMessage
      });
    }
  };

  updateTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const validation = this.validateTransactionInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const { transaction_at, description, amount, category_id, account_id, transaction_type } = req.body;
      const transaction = await this.service.updateTransaction(id, {
        transaction_at,
        description,
        amount,
        user_id: DEFAULT_USER_ID,
        category_id,
        account_id,
        transaction_type: TRANSACTION_TYPES[transaction_type]
      });

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
        return;
      }

      const response: ApiResponse<TransactionResponse> = {
        success: true,
        data: transaction
      };
      res.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update transaction';
      const statusCode = (errorMessage === 'Category not found' || errorMessage === 'Account not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message: errorMessage
      });
    }
  };

  deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleted = await this.service.deleteTransaction(id, DEFAULT_USER_ID);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete transaction';

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  };
}
