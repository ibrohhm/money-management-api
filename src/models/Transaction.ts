export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category_id: string;
  category_name: string;
  account_id: string;
  account_name: string;
  type: TransactionType;
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

export type TransactionType = 'income' | 'expense';
