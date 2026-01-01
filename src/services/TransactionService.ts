import { Transaction } from '../models/Transaction';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class TransactionService {
  private transactionRepo: TransactionRepository;
  private categoryRepo: CategoryRepository;

  constructor() {
    this.transactionRepo = new TransactionRepository();
    this.categoryRepo = new CategoryRepository();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionRepo.findAll();
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return await this.transactionRepo.findById(id);
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const category = await this.categoryRepo.findById(transaction.category_id);
    if (!category) {
      throw new Error('Category not found');
    }

    transaction.category_name = category.name
    return await this.transactionRepo.create(transaction);
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    if (transaction.category_id) {
      const category = await this.categoryRepo.findById(transaction.category_id);
      if (!category) {
        throw new Error('Category not found');
      }

      transaction.category_name = category.name;
    }

    return await this.transactionRepo.update(id, transaction);
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return await this.transactionRepo.delete(id);
  }

  async getTransactionsByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const allTransactions = await this.transactionRepo.findAll();
    return allTransactions.filter(t => t.type === type);
  }

  async getTotalByType(type: 'income' | 'expense'): Promise<number> {
    const transactions = await this.getTransactionsByType(type);
    return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }
}
