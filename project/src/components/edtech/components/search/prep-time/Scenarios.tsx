import React from 'react';
import { Target, Shield } from 'lucide-react';

interface InterventionPoint {
  title: string;
  probability: number;
  impact: number;
  plans: string[];
}

const scenarios: InterventionPoint[] = [
  {
    title: 'Primary Intervention Point',
    probability: 80,
    impact: 90,
    plans: [
      'Backup team deployment',
      'Alternative entry points',
      'Emergency protocols'
    ]
  },
  {
    title: 'Secondary Containment',
    probability: 60,
    impact: 70,
    plans: [
      'Perimeter security',
      'Civilian evacuation',
      'Support system activation'
    ]
  }
];

export const Scenarios = () => (
  <div className="space-y-6">
    <h2 className="text-xl text-white font-mono tracking-wide mb-6">SCENARIOS</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {scenarios.map((scenario) => (
        <div key={scenario.title} className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-white/70" />
              <h3 className="text-lg text-white font-mono tracking-wide">{scenario.title}</h3>
            </div>
            <Shield className="w-5 h-5 text-white/30" />
          </div>
          
          <div className="space-y-6">
            {/* Probability and Impact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 font-mono text-sm">Probability</span>
                  <span className="text-white font-mono text-sm">{scenario.probability}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${scenario.probability}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 font-mono text-sm">Impact</span>
                  <span className="text-white font-mono text-sm">{scenario.impact}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${scenario.impact}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Contingency Plans */}
            <div>
              <h4 className="text-white font-mono text-sm mb-3">CONTINGENCY PLANS</h4>
              <div className="space-y-2">
                {scenario.plans.map((plan) => (
                  <div 
                    key={plan}
                    className="px-3 py-2 bg-white/5 rounded-lg text-white/60 text-sm font-mono border-l-2 border-white/10"
                  >
                    {plan}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);