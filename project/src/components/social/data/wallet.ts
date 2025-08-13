import type { WalletBalance } from '../types/wallet';

export const walletData: WalletBalance = {
  arkDollars: 2500,
  realCurrency: 750.50,
  transactions: [
    {
      id: 'tx_1',
      date: '2024-03-12',
      type: 'deposit',
      amount: 500,
      currency: 'USD',
      description: 'Bank transfer deposit',
      status: 'completed'
    },
    {
      id: 'tx_2',
      date: '2024-03-10',
      type: 'conversion',
      amount: 1000,
      currency: 'ARK',
      description: 'USD to ARK conversion',
      status: 'completed'
    },
    {
      id: 'tx_3',
      date: '2024-03-08',
      type: 'purchase',
      amount: 500,
      currency: 'ARK',
      description: 'Digital artwork purchase',
      status: 'completed'
    }
  ]
};