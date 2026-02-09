import { AccountGroup } from "../models/AccountGroup";
import { AccountGroupRepository } from "../repositories/AccountGroupRepository";

export class AccountGroupService {
  private repository: AccountGroupRepository;

  constructor() {
    this.repository = new AccountGroupRepository();
  }

  async getAllAccountGroups(userId: number): Promise<AccountGroup[]> {
    return await this.repository.findAll(userId);
  }

  async getAccountGroupById(id: number, userId: number): Promise<AccountGroup | null> {
    return await this.repository.findById(id, userId);
  }

  async createAccountGroup(accountGroup: Omit<AccountGroup, 'id'>): Promise<AccountGroup> {
    return await this.repository.create(accountGroup);
  }

  async updateAccountGroup(id: number, accountGroup: AccountGroup): Promise<AccountGroup | null> {
    return await this.repository.update(id, accountGroup);
  }

  async deleteAccountGroup(id: number, userId: number): Promise<boolean> {
    return await this.repository.delete(id, userId);
  }
}
