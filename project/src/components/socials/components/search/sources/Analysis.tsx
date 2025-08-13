import React from 'react';
import { BarChart2, Network, Brain } from 'lucide-react';
import { SourceSection } from './SourceSection';

const analysisData = [
  {
    title: 'DATA ANALYSIS',
    icon: BarChart2,
    items: [
      'Pattern Recognition',
      'Statistical Analysis',
      'Timeline Mapping',
      'Behavioral Profiling',
      'Geographic Profiling',
      'Trend Analysis'
    ]
  },
  {
    title: 'NETWORK ANALYSIS',
    icon: Network,
    items: [
      'Connection Mapping',
      'Relationship Analysis',
      'Communication Patterns',
      'Social Networks',
      'Financial Networks',
      'Location Networks'
    ]
  },
  {
    title: 'AI INSIGHTS',
    icon: Brain,
    items: [
      'Predictive Analysis',
      'Pattern Detection',
      'Anomaly Detection',
      'Risk Assessment',
      'Behavioral Analysis',
      'Evidence Correlation'
    ]
  }
];

export const Analysis = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {analysisData.map((section) => (
      <SourceSection key={section.title} {...section} />
    ))}
  </div>
);