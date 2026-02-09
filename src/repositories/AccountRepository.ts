import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../database/connection';
import { Account } from '../models/Account';

interface AccountRow extends RowDataPacket, Account {}

export class AccountRepository {
  async findAll(userId: number): Promise<Account[]> {
    const [rows] = await pool.query<AccountRow[]>(
      'SELECT * FROM accounts WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  async findById(id: number, userId: number): Promise<Account | null> {
    const [rows] = await pool.query<AccountRow[]>(
      'SELECT * FROM accounts WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  async create(data: Account): Promise<Account> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO accounts (name, account_group_id, user_id) VALUES (?, ?, ?)',
      [data.name, data.account_group_id, data.user_id]
    );

    return {
      id: result.insertId,
      name: data.name,
      account_group_id: data.account_group_id,
      user_id: data.user_id,
      created_at: now,
      updated_at: now
    };
  }

  async update(id: number, data: Account): Promise<Account | null> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE accounts SET name = ?, account_group_id = ? WHERE id = ? AND user_id = ?',
      [data.name, data.account_group_id, id, data.user_id]
    );

    if (result.affectedRows === 0) return null;

    return {
      id,
      name: data.name,
      account_group_id: data.account_group_id,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: now
    };
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM accounts WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}
