import React from 'react';
import { BarChart2, TrendingUp, Target } from 'lucide-react';

interface InsightItem {
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

interface InsightSection {
  title: string;
  icon: typeof BarChart2 | typeof TrendingUp | typeof Target;
  insights: InsightItem[];
}

const strategicData: InsightSection[] = [
  {
    title: 'MACRO INSIGHTS',
    icon: BarChart2,
    insights: [
      { title: 'Global Market Trends', priority: 'HIGH', description: 'Increasing digitalization across sectors' },
      { title: 'Industry Forecasts', priority: 'HIGH', description: 'Projected 15% growth in tech sector' },
      { title: 'Economic Indicators', priority: 'MEDIUM', description: 'Stable growth with moderate inflation' },
      { title: 'Policy Changes', priority: 'HIGH', description: 'New regulatory framework implementation' },
      { title: 'Regulatory Updates', priority: 'MEDIUM', description: 'Enhanced data protection measures' },
      { title: 'Market Dynamics', priority: 'HIGH', description: 'Shift towards sustainable practices' }
    ]
  },
  {
    title: 'COMPETITIVE INTEL',
    icon: Target,
    insights: [
      { title: 'Competitor Strategies', priority: 'HIGH', description: 'Focus on AI-driven solutions' },
      { title: 'Market Share Analysis', priority: 'HIGH', description: '23% market share in core segment' },
      { title: 'Strategic Moves', priority: 'HIGH', description: 'Expansion into emerging markets' },
      { title: 'Partnership Data', priority: 'MEDIUM', description: 'Key alliance with tech providers' },
      { title: 'Investment Patterns', priority: 'MEDIUM', description: 'Increased R&D spending' },
      { title: 'Growth Metrics', priority: 'HIGH', description: '15% YoY revenue growth' }
    ]
  },
  {
    title: 'INDUSTRY TRENDS',
    icon: TrendingUp,
    insights: [
      { title: 'Emerging Technologies', priority: 'HIGH', description: 'Quantum computing adoption' },
      { title: 'Innovation Patterns', priority: 'HIGH', description: 'Shift to edge computing' },
      { title: 'Sector Disruptions', priority: 'HIGH', description: 'Blockchain integration' },
      { title: 'Business Models', priority: 'MEDIUM', description: 'Platform-based ecosystems' },
      { title: 'Consumer Behavior', priority: 'HIGH', description: 'Privacy-focused solutions' },
      { title: 'Market Sentiment', priority: 'MEDIUM', description: 'Strong confidence in sector' }
    ]
  }
];

export const StrategicAnalysis = () => (
  <div className="space-y-6">
    <h2 className="text-xl text-white font-mono tracking-wide mb-6">STRATEGIC ANALYSIS</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {strategicData.map((section) => (
        <div key={section.title} className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <section.icon className="w-5 h-5 text-white/70" />
            <h3 className="text-lg text-white font-mono tracking-wide">{section.title}</h3>
          </div>
          
          <div className="space-y-4">
            {section.insights.map((insight) => (
              <div key={insight.title} className="border-l-2 border-white/10 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-mono text-sm">{insight.title}</h4>
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    insight.priority === 'HIGH' 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : insight.priority === 'MEDIUM'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-white/60 text-sm font-mono">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);