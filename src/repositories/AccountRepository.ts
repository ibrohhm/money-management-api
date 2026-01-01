import accountsData from '../data/accounts.json'
import { Account } from '../models/Account'

export class AccountRepository {
  private accounts: Account[] = accountsData as Account[];

  async findAll(): Promise<Account[]> {
    return this.accounts
  }

  async findById(id: string): Promise<Account | null> {
    const account = this.accounts.find(t => t.id === id);
    return account || null;
  }

  async create(account: Omit<Account, 'id'>): Promise<Account> {
    const newAccount: Account = {
      id: String(this.accounts.length + 1),
      ...account
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  async update(id: string, account: Partial<Account>): Promise<Account | null> {
    const index = this.accounts.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.accounts[index] = { ...this.accounts[index], ...account };
    return this.accounts[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.accounts.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.accounts.splice(index, 1);
    return true;
  }
}
