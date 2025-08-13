import React from 'react';
import ReferralDashboard from '../components/dashboard/ReferralDashboard';

const ReferralTest = () => {
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl text-white font-light mb-2">🎉 Referral System Test</h1>
          <p className="text-zinc-400">
            If you can see this page, the referral button is working! Below is your professional dashboard:
          </p>
        </div>
        
        <ReferralDashboard />
      </div>
    </div>
  );
};

export default ReferralTest;
