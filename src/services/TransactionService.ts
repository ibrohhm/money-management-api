import { Transaction, TransactionResponse, TransactionGroup } from '../models/Transaction';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { AccountRepository } from '../repositories/AccountRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class TransactionService {
  private transactionRepo: TransactionRepository;
  private categoryRepo: CategoryRepository;
  private accountRepo: AccountRepository;

  constructor() {
    this.transactionRepo = new TransactionRepository();
    this.categoryRepo = new CategoryRepository();
    this.accountRepo = new AccountRepository();
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

    const account = await this.accountRepo.findById(transaction.account_id);
    if (!account) {
      throw new Error('Account not found');
    }

    transaction.category_name = category.name;
    transaction.account_name = account.name;
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

    if (transaction.account_id) {
      const account = await this.accountRepo.findById(transaction.account_id);
      if (!account) {
        throw new Error('Account not found');
      }

      transaction.account_name = account.name;
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

  groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
    const groupMap = new Map<string, Transaction[]>();
    transactions.forEach(transaction => {
      const dateOnly = transaction.date.split('T')[0];
      if (!groupMap.has(dateOnly)) {
        groupMap.set(dateOnly, []);
      }

      groupMap.get(dateOnly)!.push(transaction);
    });

    const groups: TransactionGroup[] = [];
    groupMap.forEach((transactions, date) => {
      const total_income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const total_expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const net_total = total_income - total_expense;

      groups.push({
        date,
        total_income,
        total_expense,
        net_total,
        transaction_count: transactions.length,
        transactions: transactions.map(t => this.mapToResponse(t))
      });
    });

    return groups.sort((a, b) => b.date.localeCompare(a.date));
  }

  private mapToResponse(transaction: Transaction): TransactionResponse {
    return {
      ...transaction,
      currency: 'Rp'
    };
  }
}
