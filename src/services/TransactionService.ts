import { Transaction, TransactionResponse, TransactionGroup, TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from '../models/Transaction';
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

  async getAllTransactions(userId: number): Promise<Transaction[]> {
    return await this.transactionRepo.findAll(userId);
  }

  async getTransactionById(id: number, userId: number): Promise<Transaction | null> {
    return await this.transactionRepo.findById(id, userId);
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const category = await this.categoryRepo.findById(transaction.category_id, transaction.user_id);
    if (!category) {
      throw new Error('Category not found');
    }

    const account = await this.accountRepo.findById(transaction.account_id, transaction.user_id);
    if (!account) {
      throw new Error('Account not found');
    }

    return await this.transactionRepo.create(transaction);
  }

  async updateTransaction(id: number, transaction: Transaction): Promise<Transaction | null> {
    const category = await this.categoryRepo.findById(transaction.category_id, transaction.user_id);
    if (!category) {
      throw new Error('Category not found');
    }

    const account = await this.accountRepo.findById(transaction.account_id, transaction.user_id);
    if (!account) {
      throw new Error('Account not found');
    }

    return await this.transactionRepo.update(id, transaction);
  }

  async deleteTransaction(id: number, userId: number): Promise<boolean> {
    return await this.transactionRepo.delete(id, userId);
  }

  groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
    const groupMap = new Map<string, Transaction[]>();
    transactions.forEach(transaction => {
      const dateOnly = new Date(transaction.transaction_at).toISOString().split('T')[0];
      if (!groupMap.has(dateOnly)) {
        groupMap.set(dateOnly, []);
      }

      groupMap.get(dateOnly)!.push(transaction);
    });

    const groups: TransactionGroup[] = [];
    groupMap.forEach((transactions, date) => {
      const total_income = transactions
        .filter(t => t.transaction_type === TRANSACTION_TYPES.income)
        .reduce((sum, t) => sum + t.amount, 0);

      const total_expense = transactions
        .filter(t => t.transaction_type === TRANSACTION_TYPES.expense)
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
      currency: 'Rp',
      transaction_type: TRANSACTION_TYPE_LABELS[transaction.transaction_type]
    };
  }
}
