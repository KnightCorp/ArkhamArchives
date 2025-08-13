import React, { useState } from 'react';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface ReferralData {
  id: number;
  name: string;
  date: string;
  earnings: number;
  products: string[];
}

interface UserData {
  referralCode: string;
  totalEarnings: number;
  referrals: ReferralData[];
}

interface Props {
  userData: UserData;
}

const ReferralStats: React.FC<Props> = ({ userData }) => {
  const [showReferrals, setShowReferrals] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userData.referralCode);
    alert('Referral code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Your Referral Code</h2>
        
        <div className="flex items-center justify-between p-3 bg-white/5 rounded">
          <code className="text-lg text-white">{userData.referralCode}</code>
          <button
            onClick={copyReferralCode}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <Copy className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Earnings</h2>
        <div className="text-3xl font-bold text-white">${userData.totalEarnings.toFixed(2)}</div>
        <p className="text-gray-400 text-sm">Total referral earnings</p>
      </div>

      <div className="glass p-6 rounded-lg">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setShowReferrals(!showReferrals)}
        >
          <h2 className="text-2xl font-bold text-white">Recent Referrals</h2>
          {showReferrals ? (
            <ChevronUp className="w-5 h-5 text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white" />
          )}
        </button>

        {showReferrals && (
          <div className="mt-4 space-y-4">
            {userData.referrals.map((referral) => (
              <div key={referral.id} className="p-4 bg-white/5 rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{referral.name}</h3>
                    <p className="text-sm text-gray-400">{referral.date}</p>
                  </div>
                  <span className="text-white font-bold">${referral.earnings}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {referral.products.map((product) => (
                    <span
                      key={product}
                      className="text-xs px-2 py-1 bg-white/10 text-white rounded"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralStats;