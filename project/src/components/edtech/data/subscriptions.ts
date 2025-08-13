import type { Subscription, BillingHistory } from '../types/subscription';

export const currentSubscription: Subscription = {
  id: 'sub_123',
  tier: 'pro',
  status: 'active',
  startDate: '2024-02-01',
  endDate: '2024-03-01',
  autoRenew: true,
  price: 29.99,
  features: [
    'Advanced Analytics',
    'Priority Support',
    'Custom Themes',
    'API Access',
    'Unlimited Storage'
  ]
};

export const billingHistory: BillingHistory[] = [
  {
    id: 'bill_1',
    date: '2024-02-01',
    amount: 29.99,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription'
  },
  {
    id: 'bill_2',
    date: '2024-01-01',
    amount: 29.99,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription'
  }
];