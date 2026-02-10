export interface Category {
  id?: number;
  name: string;
  category_type: number;
  parent_id?: number | null;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export const CATEGORY_TYPES: Record<string, number> = {
  income: 1,
  expense: 2,
};

export const CATEGORY_TYPE_LABELS: Record<number, string> = {
  1: 'income',
  2: 'expense',
};
