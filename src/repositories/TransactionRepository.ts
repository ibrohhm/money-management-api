import { Transaction } from '../models/Transaction';
import transactionsData from '../data/transactions.json';

export class TransactionRepository {
  private transactions: Transaction[] = transactionsData as Transaction[];

  async findAll(): Promise<Transaction[]> {
    return this.transactions;
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.transactions.find(t => t.id === id);
    return transaction || null;
  }

  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: String(this.transactions.length + 1)
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.transactions[index] = { ...this.transactions[index], ...transaction };
    return this.transactions[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.transactions.splice(index, 1);
    return true;
  }
}
