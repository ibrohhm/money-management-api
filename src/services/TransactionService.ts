import { Transaction, TransactionResponse, TransactionGroup, TRANSACTION_TYPE_LABELS } from '../models/Transaction';
import { CATEGORY_TYPE_LABELS } from '../models/Category';
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

  async getAllTransactions(userId: number): Promise<TransactionResponse[]> {
    const transactions = await this.transactionRepo.findAll(userId);
    if (!transactions.length) {
      return [];
    }

    const categoryIds = [...new Set(transactions.map(t => t.category_id))];
    const categories = await this.categoryRepo.findByIds(categoryIds, userId);
    const categoryMap = new Map(categories.map(c => [Number(c.id), c]));

    const accountIds = [...new Set(transactions.map(t => t.account_id))];
    const accounts = await this.accountRepo.findByIds(accountIds, userId);
    const accountMap = new Map(accounts.map(c => [Number(c.id), c]));

    return transactions.map(transaction => {
      const category = categoryMap.get(transaction.category_id);
      if (!category) {
        throw new Error(`Category not found for transaction ${transaction.id}`);
      }

      const account = accountMap.get(transaction.account_id);
      if (!account) {
        throw new Error(`Account not found for transaction ${transaction.id}`);
      }

      const { category_id, transaction_type, ...rest } = transaction;
      return {
        ...rest,
        currency: 'Rp',
        transaction_type: TRANSACTION_TYPE_LABELS[transaction_type],
        category: {
          id: Number(category.id),
          name: category.name,
          type: CATEGORY_TYPE_LABELS[category.category_type]
        },
        account: {
          id: Number(account.id),
          name: account.name,
        }
      };
    });
  }

  async getTransactionById(id: number, userId: number): Promise<TransactionResponse | null> {
    const transaction = await this.transactionRepo.findById(id, userId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const category = await this.categoryRepo.findById(transaction.category_id, transaction.user_id);
    if (!category) {
      throw new Error('Category not found');
    }

    const account = await this.accountRepo.findById(transaction.account_id, transaction.user_id);
    if (!account) {
      throw new Error('Account not found');
    }

    const { category_id, account_id, transaction_type, ...rest } = transaction;
    return {
      ...rest,
      currency: 'Rp',
      transaction_type: TRANSACTION_TYPE_LABELS[transaction_type],
      category: {
        id: Number(category.id),
        name: category.name,
        type: CATEGORY_TYPE_LABELS[category.category_type]
      },
      account: {
        id: Number(account.id),
        name: account.name,
      }
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<TransactionResponse> {
    const category = await this.categoryRepo.findById(transaction.category_id, transaction.user_id);
    if (!category) {
      throw new Error('Category not found');
    }

    const account = await this.accountRepo.findById(transaction.account_id, transaction.user_id);
    if (!account) {
      throw new Error('Account not found');
    }

    const newTransaction = await this.transactionRepo.create(transaction);
    const { category_id, account_id, transaction_type, ...rest } = newTransaction;
    return {
      ...rest,
      currency: 'Rp',
      transaction_type: TRANSACTION_TYPE_LABELS[transaction_type],
      category: {
        id: Number(category.id),
        name: category.name,
        type: CATEGORY_TYPE_LABELS[category.category_type]
      },
      account: {
        id: Number(account.id),
        name: account.name,
      }
    }
  }

  async updateTransaction(id: number, transaction: Transaction): Promise<TransactionResponse | null> {
    const category = await this.categoryRepo.findById(transaction.category_id, transaction.user_id);
    if (!category) {
      throw new Error('Category not found');
    }

    const account = await this.accountRepo.findById(transaction.account_id, transaction.user_id);
    if (!account) {
      throw new Error('Account not found');
    }

    const newTransaction = await this.transactionRepo.update(id, transaction);
    if (!newTransaction) {
      return null;
    }

    const { category_id, account_id, transaction_type, ...rest } = newTransaction;
    return {
      ...rest,
      currency: 'Rp',
      transaction_type: TRANSACTION_TYPE_LABELS[transaction_type],
      category: {
        id: Number(category.id),
        name: category.name,
        type: CATEGORY_TYPE_LABELS[category.category_type]
      },
      account: {
        id: Number(account.id),
        name: account.name,
      }
    }
  }

  async deleteTransaction(id: number, userId: number): Promise<boolean> {
    return await this.transactionRepo.delete(id, userId);
  }

  groupTransactionsByDate(transactions: TransactionResponse[]): TransactionGroup[] {
    const groupMap = new Map<string, TransactionResponse[]>();
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
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const total_expense = transactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const net_total = total_income - total_expense;

      groups.push({
        date,
        total_income,
        total_expense,
        net_total,
        transaction_count: transactions.length,
        transactions
      });
    });

    return groups.sort((a, b) => b.date.localeCompare(a.date));
  }
}
