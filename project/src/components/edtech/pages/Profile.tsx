import React, { useState } from 'react';
import { ProfileInfo } from '../components/profile/ProfileInfo';
import { PreferencesManager } from '../components/profile/PreferencesManager';
import { ProfileStats } from '../components/profile/ProfileStats';
import { ProfileInventory } from '../components/profile/ProfileInventory';
import { BrowserSettings } from '../components/profile/BrowserSettings';
import { Tabs } from '../components/ui/Tabs';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'preferences', label: 'Preferences & Interests' },
    { id: 'stats', label: 'Stats' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'browser', label: 'Browser & Search' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'preferences':
        return <PreferencesManager />;
      case 'stats':
        return <ProfileStats />;
      case 'inventory':
        return <ProfileInventory />;
      case 'browser':
        return <BrowserSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-typewriter text-zinc-200 mb-8">Profile Settings</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default Profile;