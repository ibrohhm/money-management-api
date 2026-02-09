import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../database/connection';
import { AccountGroup } from '../models/AccountGroup';

interface AccountGroupRow extends RowDataPacket, AccountGroup {}

export class AccountGroupRepository {
  async findAll(userId: number): Promise<AccountGroup[]> {
    const [rows] = await pool.query<AccountGroupRow[]>(
      'SELECT * FROM account_groups WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  async findById(id: number, userId: number): Promise<AccountGroup | null> {
    const [rows] = await pool.query<AccountGroupRow[]>(
      'SELECT * FROM account_groups WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  async create(data: AccountGroup): Promise<AccountGroup> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO account_groups (name, user_id) VALUES (?, ?)',
      [data.name, data.user_id]
    );

    return {
      id: result.insertId,
      name: data.name,
      user_id: data.user_id,
      created_at: now,
      updated_at: now
    };
  }

  async update(id: number, data: AccountGroup): Promise<AccountGroup | null> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE account_groups SET name = ? WHERE id = ? AND user_id = ?',
      [data.name, id, data.user_id]
    );

    if (result.affectedRows === 0) return null;

    return {
      id,
      name: data.name,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: now
    };
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM account_groups WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}
