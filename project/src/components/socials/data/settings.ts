import type { AppSettings, TermsSection } from '../types/settings';

export const appSettings: AppSettings = {
  theme: 'darker',
  notifications: {
    email: true,
    push: true,
    marketing: false
  },
  privacy: {
    profileVisibility: 'public',
    activityStatus: true,
    readReceipts: true
  },
  language: 'en',
  timezone: 'UTC'
};

export const termsAndConditions: TermsSection[] = [
  {
    title: 'Terms of Service',
    content: 'These terms and conditions outline the rules and regulations for the use of our Platform...',
    lastUpdated: '2024-02-15'
  },
  {
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. It is our policy to respect your privacy regarding any information...',
    lastUpdated: '2024-02-15'
  },
  {
    title: 'Content Guidelines',
    content: 'To ensure a safe and respectful environment, we have established the following content guidelines...',
    lastUpdated: '2024-02-10'
  }
];