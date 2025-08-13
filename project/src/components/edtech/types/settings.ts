export interface AppSettings {
  theme: 'dark' | 'darker';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'followers';
    activityStatus: boolean;
    readReceipts: boolean;
  };
  language: string;
  timezone: string;
}

export interface TermsSection {
  title: string;
  content: string;
  lastUpdated: string;
}