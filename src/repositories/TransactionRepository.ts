import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../database/connection';
import { Transaction } from '../models/Transaction';

interface TransactionRow extends RowDataPacket, Transaction {}
export class TransactionRepository {
  async findAll(userId: number): Promise<Transaction[]> {
    const [rows] = await pool.query<TransactionRow[]>(
      'SELECT * FROM transactions WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  async findById(id: number, userId: number): Promise<Transaction | null> {
    const [rows] = await pool.query<TransactionRow[]>(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  async create(data: Transaction): Promise<Transaction> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO transactions (transaction_at, description, amount, user_id, category_id, account_id, transaction_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.transaction_at, data.description, data.amount, data.user_id, data.category_id, data.account_id, data.transaction_type]
    );

    return {
      id: result.insertId,
      transaction_at: data.transaction_at,
      description: data.description,
      amount: data.amount,
      user_id: data.user_id,
      category_id: data.category_id,
      account_id: data.account_id,
      transaction_type: data.transaction_type,
      created_at: now,
      updated_at: now
    }
  }

  async update(id: number, data: Transaction): Promise<Transaction | null> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE transactions SET transaction_at = ?, description = ?, amount = ?, category_id = ?, account_id = ?, transaction_type = ? WHERE id = ? AND user_id = ?',
      [data.transaction_at, data.description, data.amount, data.category_id, data.account_id, data.transaction_type, id, data.user_id]
    );

    if (result.affectedRows === 0) return null;

    return {
      id: id,
      transaction_at: data.transaction_at,
      description: data.description,
      amount: data.amount,
      user_id: data.user_id,
      category_id: data.category_id,
      account_id: data.account_id,
      transaction_type: data.transaction_type,
      created_at: data.created_at,
      updated_at: now
    }
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}
