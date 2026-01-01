import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { ApiResponse } from '../types/response';
import { Transaction } from '../models/Transaction';

export class TransactionHandler {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  private validateTransactionInput(data: any): { valid: boolean; error?: string } {
    const { date, description, amount, category_id, account_id, type } = data;

    // Validate required fields
    if (!date || !description || amount === undefined || !category_id || !account_id || !type) {
      return {
        valid: false,
        error: 'Missing required fields: date, description, amount, category_id, account_id, and type are required'
      };
    }

    // Validate type
    if (type !== 'income' && type !== 'expense') {
      return {
        valid: false,
        error: 'Invalid type. Must be either "income" or "expense"'
      };
    }

    // Validate amount is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return {
        valid: false,
        error: 'Amount must be a valid number'
      };
    }

    // Validate date format (basic ISO date check)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return {
        valid: false,
        error: 'Invalid date format. Expected YYYY-MM-DD'
      };
    }

    return { valid: true };
  }

  getAllTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactions = await this.service.getAllTransactions();
      const response: ApiResponse<Transaction[]> = {
        success: true,
        data: transactions,
        count: transactions.length
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions'
      });
    }
  };

  getTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const transaction = await this.service.getTransactionById(id);

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
        return;
      }

      const response: ApiResponse<Transaction> = {
        success: true,
        data: transaction
      };
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transaction'
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

      const transaction = await this.service.createTransaction(req.body);
      const response: ApiResponse<Transaction> = {
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
      const { id } = req.params;

      const validation = this.validateTransactionInput(req.body);
      if (!validation.valid) {
        res.status(422).json({
          success: false,
          message: validation.error
        });
        return;
      }

      const transaction = await this.service.updateTransaction(id, req.body);

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
        return;
      }

      const response: ApiResponse<Transaction> = {
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
      const { id } = req.params;
      const deleted = await this.service.deleteTransaction(id);

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
      res.status(500).json({
        success: false,
        message: 'Failed to delete transaction'
      });
    }
  };
}
