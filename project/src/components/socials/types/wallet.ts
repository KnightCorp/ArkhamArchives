export interface WalletBalance {
  arkDollars: number;
  realCurrency: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'conversion' | 'purchase';
  amount: number;
  currency: 'ARK' | 'USD';
  description: string;
  status: 'completed' | 'pending' | 'failed';
}