export interface Transaction {
  id?: number;
  transaction_at: Date;
  description: string;
  amount: number;
  user_id: number;
  category_id: number;
  account_id: number;
  transaction_type: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TransactionResponse extends Transaction {
  currency: string;
}

export interface TransactionGroup {
  date: string;
  total_income: number;
  total_expense: number;
  net_total: number;
  transaction_count: number;
  transactions: TransactionResponse[];
}

export const TRANSACTION_TYPES: Record<string, number> = {
  income: 1,
  expense: 2,
};

export const TRANSACTION_TYPE_LABELA: Record<number, string> = {
  1: 'income',
  2: 'expense',
};