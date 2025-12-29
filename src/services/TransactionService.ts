import { Transaction } from '../models/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class TransactionService {
  private repository: TransactionRepository;

  constructor() {
    this.repository = new TransactionRepository();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.repository.findAll();
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return await this.repository.findById(id);
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    return await this.repository.create(transaction);
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    return await this.repository.update(id, transaction);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async getTransactionsByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const allTransactions = await this.repository.findAll();
    return allTransactions.filter(t => t.type === type);
  }

  async getTotalByType(type: 'income' | 'expense'): Promise<number> {
    const transactions = await this.getTransactionsByType(type);
    return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }
}
