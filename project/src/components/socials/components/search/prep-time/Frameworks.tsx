import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface Framework {
  title: string;
  icon: typeof Shield | typeof AlertTriangle;
  steps: Step[];
  considerations: string[];
}

const frameworks: Framework[] = [
  {
    title: 'Preparation Matrix',
    icon: Shield,
    steps: [
      { title: 'Identify critical failure points', description: 'Map potential vulnerabilities and weak spots' },
      { title: 'Assess probability and impact', description: 'Evaluate likelihood and severity of each scenario' },
      { title: 'Develop contingency plans', description: 'Create detailed response strategies' },
      { title: 'Test and refine responses', description: 'Simulate scenarios and optimize responses' }
    ],
    considerations: [
      'Resource availability',
      'Time constraints',
      'Environmental factors',
      'Civilian safety'
    ]
  },
  {
    title: 'Threat Modeling Framework',
    icon: AlertTriangle,
    steps: [
      { title: 'Map attack vectors', description: 'Identify potential threat entry points' },
      { title: 'Assess vulnerabilities', description: 'Evaluate system and operational weaknesses' },
      { title: 'Develop countermeasures', description: 'Design defensive strategies' },
      { title: 'Create response protocols', description: 'Establish incident response procedures' }
    ],
    considerations: [
      'Threat capabilities',
      'Asset protection',
      'Response time',
      'Collateral damage'
    ]
  }
];

export const Frameworks = () => (
  <div className="space-y-6">
    <h2 className="text-xl text-white font-bold tracking-wider uppercase mb-6">FRAMEWORKS</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {frameworks.map((framework) => (
        <div key={framework.title} className="bg-black/80 border-2 border-bat-red/30 rounded-lg p-6 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all">
          <div className="flex items-center space-x-3 mb-6">
            <framework.icon className="w-5 h-5 text-bat-red/70" />
            <h3 className="text-lg text-white font-bold tracking-wider uppercase">{framework.title}</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold tracking-wider uppercase text-sm mb-4">STEPS</h4>
              <div className="space-y-4">
                {framework.steps.map((step, index) => (
                  <div key={step.title} className="border-l-2 border-bat-red/20 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white/40 font-montserrat text-sm">{index + 1}.</span>
                      <h5 className="text-white font-bold tracking-wider uppercase text-sm">{step.title}</h5>
                    </div>
                    <p className="text-white/60 text-sm font-montserrat">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold tracking-wider uppercase text-sm mb-4">CONSIDERATIONS</h4>
              <div className="grid grid-cols-2 gap-2">
                {framework.considerations.map((consideration) => (
                  <div
                    key={consideration}
                    className="px-3 py-2 bg-black/50 border border-bat-red/20 rounded-lg text-white/60 text-sm font-montserrat"
                  >
                    {consideration}
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