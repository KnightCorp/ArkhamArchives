import React from 'react';
import { Users, Coins, Award, TrendingUp } from 'lucide-react';

export const ExamTeam = () => {
  const mockTeam = [
    {
      id: 1,
      name: 'CyberScholar',
      role: 'Team Captain',
      rating: 2150,
      speciality: 'Computer Science',
      price: 1500
    },
    {
      id: 2,
      name: 'QuantumMind',
      role: 'Member',
      rating: 1950,
      speciality: 'Physics',
      price: 1200
    }
  ];

  return (
    <div className="space-y-8">
      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-matrix/70 mb-4">
            <Users className="w-5 h-5" />
            <span className="font-code">Team Size</span>
          </div>
          <div className="text-3xl text-matrix font-code">2/5</div>
        </div>
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-matrix/70 mb-4">
            <Coins className="w-5 h-5" />
            <span className="font-code">Budget</span>
          </div>
          <div className="text-3xl text-matrix font-code">5000</div>
        </div>
        <div className="bg-black/50 border border-matrix/30 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-matrix/70 mb-4">
            <Award className="w-5 h-5" />
            <span className="font-code">Team Rating</span>
          </div>
          <div className="text-3xl text-matrix font-code">2050</div>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-4">
        <h3 className="text-xl text-matrix font-code">Current Roster</h3>
        {mockTeam.map((member) => (
          <div key={member.id} className="bg-black/50 border border-matrix/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-matrix font-code">{member.name}</h4>
                <p className="text-matrix/60 font-code">{member.role}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 text-matrix font-code">
                  <TrendingUp className="w-4 h-4" />
                  <span>{member.rating}</span>
                </div>
                <p className="text-matrix/60 font-code">{member.speciality}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Market */}
      <div>
        <h3 className="text-xl text-matrix font-code mb-4">Transfer Market</h3>
        <button className="w-full px-6 py-3 bg-black/50 text-matrix border border-matrix/30 rounded-lg hover:bg-matrix/10 transition-all font-code">
          Open Market
        </button>
      </div>
    </div>
  );
};