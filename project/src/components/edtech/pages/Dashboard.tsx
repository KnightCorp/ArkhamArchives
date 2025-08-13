import React, { useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { SubscriptionOverview } from '../components/dashboard/SubscriptionOverview';
import { BillingHistory } from '../components/dashboard/BillingHistory';
import { SubscriptionSettings } from '../components/dashboard/SubscriptionSettings';
import { AdCampaigns } from '../components/dashboard/AdCampaigns';
import { Insights } from '../components/dashboard/Insights';
import { Wallet } from '../components/dashboard/Wallet';
import { Tracker } from '../components/dashboard/Tracker';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'campaigns', label: 'Ad Campaigns' },
    { id: 'insights', label: 'Insights' },
    { id: 'tracker', label: 'Tracker' },
    { id: 'billing', label: 'Billing History' },
    { id: 'settings', label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SubscriptionOverview />;
      case 'wallet':
        return <Wallet />;
      case 'campaigns':
        return <AdCampaigns />;
      case 'insights':
        return <Insights />;
      case 'tracker':
        return <Tracker />;
      case 'billing':
        return <BillingHistory />;
      case 'settings':
        return <SubscriptionSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl detective-text text-zinc-200 mb-8">Dashboard</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;