import { Account  } from "../models/Account";
import { AccountRepository } from "../repositories/AccountRepository";

export class AccountService {
  private repository: AccountRepository;

  constructor() {
    this.repository = new AccountRepository();
  }

  async getAllAccounts(userId: number): Promise<Account[]> {
    return await this.repository.findAll(userId);
  }

  async getAccountById(id: number, userId: number): Promise<Account | null> {
    return await this.repository.findById(id, userId);
  }

  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    return await this.repository.create(account);
  }

  async updateAccount(id: number, account: Account): Promise<Account | null> {
    return await this.repository.update(id, account)
  }

  async deleteAccount(id: number, userId: number): Promise<boolean> {
    return await this.repository.delete(id, userId)
  }
}
