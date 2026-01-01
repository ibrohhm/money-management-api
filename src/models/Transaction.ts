export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string;
  category_name: string;
  type: TransactionType;
}

export type TransactionType = 'income' | 'expense';
