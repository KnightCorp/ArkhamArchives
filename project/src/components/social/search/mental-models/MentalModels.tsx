import React from 'react';
import { MentalModel } from './MentalModel';

const mentalModels = [
  {
    title: 'Inversion Thinking',
    description: 'Start with the end goal and work backwards to identify potential failure points',
    applications: [
      'Complex problem solving',
      'Risk assessment',
      'Strategic planning'
    ],
    examples: [
      { text: 'Instead of how to succeed, analyze how to fail' },
      { text: 'Identify weak points in enemy strategy' },
      { text: 'Reverse engineer criminal patterns' }
    ]
  },
  {
    title: 'Second-Order Thinking',
    description: 'Consider the consequences of consequences',
    applications: [
      'Long-term planning',
      'Strategic moves',
      'Contingency planning'
    ],
    examples: [
      { text: 'Impact of new security measures' },
      { text: 'Ripple effects of taking down crime networks' },
      { text: 'Consequences of revealing evidence timing' }
    ]
  }
];

export const MentalModels = () => (
  <div className="space-y-6">
    <h2 className="text-xl text-white font-mono tracking-wide mb-6">MENTAL MODELS</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mentalModels.map((model) => (
        <MentalModel key={model.title} {...model} />
      ))}
    </div>
  </div>
);