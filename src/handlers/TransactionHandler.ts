import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { ApiResponse } from '../types/response';
import { Transaction } from '../models/Transaction';

export class TransactionHandler {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
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
      const transaction = await this.service.createTransaction(req.body);
      const response: ApiResponse<Transaction> = {
        success: true,
        data: transaction
      };
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create transaction'
      });
    }
  };

  updateTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
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
      res.status(500).json({
        success: false,
        message: 'Failed to update transaction'
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
