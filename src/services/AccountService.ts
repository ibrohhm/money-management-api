import { Account  } from "../models/Account";
import { AccountRepository } from "../repositories/AccountRepository";

export class AccountService {
  private repository: AccountRepository;

  constructor() {
    this.repository = new AccountRepository();
  }

  async getAllAccounts(): Promise<Account[]> {
    return await this.repository.findAll();
  }

  async getAccountById(id: string): Promise<Account | null> {
    return await this.repository.findById(id);
  }

  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    return await this.repository.create(account);
  }

  async updateAccount(id: string, account: Partial<Account>): Promise<Account | null> {
    return await this.repository.update(id, account)
  }

  async deleteAccount(id: string): Promise<boolean> {
    return await this.repository.delete(id)
  }
}
