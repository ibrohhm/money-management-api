import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../database/connection';
import { Category } from '../models/Category';

interface CategoryRow extends RowDataPacket, Category {}

export class CategoryRepository {
  async findAll(userId: number, categoryType?: number): Promise<Category[]> {
    if (categoryType) {
      const [rows] = await pool.query<CategoryRow[]>(
        'SELECT * FROM categories WHERE user_id = ? AND category_type = ?',
        [userId, categoryType]
      );
      return rows;
    }

    const [rows] = await pool.query<CategoryRow[]>(
      'SELECT * FROM categories WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  async findById(id: number, userId: number): Promise<Category | null> {
    const [rows] = await pool.query<CategoryRow[]>(
      'SELECT * FROM categories WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  async findByIds(ids: number[], userId: number): Promise<Category[]> {
    const [rows] = await pool.query<CategoryRow[]>(
      'SELECT * FROM categories WHERE id IN (?) AND user_id = ?',
      [ids, userId]
    );
    return rows;
  }

  async create(data: Category): Promise<Category> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (name, category_type, parent_id, user_id) VALUES (?, ?, ?, ?)',
      [data.name, data.category_type, data.parent_id || null, data.user_id]
    );

    return {
      id: result.insertId,
      name: data.name,
      category_type: data.category_type,
      parent_id: data.parent_id || null,
      user_id: data.user_id,
      created_at: now,
      updated_at: now
    };
  }

  async update(id: number, data: Category): Promise<Category | null> {
    const now = new Date();
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE categories SET name = ?, category_type = ?, parent_id = ? WHERE id = ? AND user_id = ?',
      [data.name, data.category_type, data.parent_id || null, id, data.user_id]
    );

    if (result.affectedRows === 0) return null;

    return {
      id,
      name: data.name,
      category_type: data.category_type,
      parent_id: data.parent_id || null,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: now
    };
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}
