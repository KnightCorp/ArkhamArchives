import React, { useState } from 'react';
import { Settings, Database, Brain, Filter, Sliders, Save } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
}

interface AIModel {
  id: string;
  name: string;
  type: string;
  description: string;
  enabled: boolean;
}

interface Framework {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
}

const dataSources: DataSource[] = [
  {
    id: 'police-db',
    name: 'Police Database',
    category: 'Law Enforcement',
    description: 'Criminal records, case files, and incident reports',
    enabled: true
  },
  {
    id: 'forensics-db',
    name: 'Forensics Database',
    category: 'Scientific',
    description: 'Laboratory results, evidence analysis, and forensic reports',
    enabled: true
  },
  {
    id: 'intel-db',
    name: 'Intelligence Network',
    category: 'Intelligence',
    description: 'Surveillance data, informant reports, and intelligence briefings',
    enabled: false
  }
];

const aiModels: AIModel[] = [
  {
    id: 'pattern-ai',
    name: 'Pattern Recognition AI',
    type: 'Analysis',
    description: 'Advanced pattern detection in complex datasets',
    enabled: true
  },
  {
    id: 'nlp-ai',
    name: 'Natural Language Processing',
    type: 'Text Analysis',
    description: 'Text analysis and semantic understanding',
    enabled: true
  },
  {
    id: 'prediction-ai',
    name: 'Predictive Analysis',
    type: 'Forecasting',
    description: 'Behavioral prediction and trend analysis',
    enabled: false
  }
];

const frameworks: Framework[] = [
  {
    id: 'deductive',
    name: 'Deductive Analysis',
    category: 'Logic',
    description: 'Systematic approach to evidence analysis',
    enabled: true
  },
  {
    id: 'network',
    name: 'Network Analysis',
    category: 'Relationships',
    description: 'Connection mapping and relationship analysis',
    enabled: true
  },
  {
    id: 'temporal',
    name: 'Temporal Analysis',
    category: 'Time-based',
    description: 'Timeline analysis and event correlation',
    enabled: false
  }
];

export const Customization = () => {
  const [selectedSources, setSelectedSources] = useState(dataSources);
  const [selectedModels, setSelectedModels] = useState(aiModels);
  const [selectedFrameworks, setSelectedFrameworks] = useState(frameworks);

  const toggleSource = (id: string) => {
    setSelectedSources(prev => 
      prev.map(source => 
        source.id === id ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const toggleModel = (id: string) => {
    setSelectedModels(prev => 
      prev.map(model => 
        model.id === id ? { ...model, enabled: !model.enabled } : model
      )
    );
  };

  const toggleFramework = (id: string) => {
    setSelectedFrameworks(prev => 
      prev.map(framework => 
        framework.id === id ? { ...framework, enabled: !framework.enabled } : framework
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-white/70" />
          <h2 className="text-lg text-white font-mono tracking-wide">SEARCH CUSTOMIZATION</h2>
        </div>
        <button className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-mono tracking-wide flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {/* Data Sources */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-5 h-5 text-white/70" />
          <h3 className="text-lg text-white font-mono tracking-wide">DATA SOURCES</h3>
        </div>
        
        <div className="space-y-4">
          {selectedSources.map((source) => (
            <div key={source.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
              <div>
                <div className="flex items-center space-x-3">
                  <h4 className="text-white font-mono">{source.name}</h4>
                  <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 font-mono">
                    {source.category}
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-1 font-mono">{source.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={source.enabled}
                  onChange={() => toggleSource(source.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* AI Models */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-5 h-5 text-white/70" />
          <h3 className="text-lg text-white font-mono tracking-wide">AI MODELS</h3>
        </div>
        
        <div className="space-y-4">
          {selectedModels.map((model) => (
            <div key={model.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
              <div>
                <div className="flex items-center space-x-3">
                  <h4 className="text-white font-mono">{model.name}</h4>
                  <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 font-mono">
                    {model.type}
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-1 font-mono">{model.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={model.enabled}
                  onChange={() => toggleModel(model.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Frameworks */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="w-5 h-5 text-white/70" />
          <h3 className="text-lg text-white font-mono tracking-wide">ANALYSIS FRAMEWORKS</h3>
        </div>
        
        <div className="space-y-4">
          {selectedFrameworks.map((framework) => (
            <div key={framework.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
              <div>
                <div className="flex items-center space-x-3">
                  <h4 className="text-white font-mono">{framework.name}</h4>
                  <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 font-mono">
                    {framework.category}
                  </span>
                </div>
                <p className="text-white/60 text-sm mt-1 font-mono">{framework.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={framework.enabled}
                  onChange={() => toggleFramework(framework.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Sliders className="w-5 h-5 text-white/70" />
          <h3 className="text-lg text-white font-mono tracking-wide">ADVANCED SETTINGS</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/60 font-mono text-sm mb-2">Search Depth</label>
            <select className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white font-mono">
              <option value="shallow">Shallow (Fast)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="deep">Deep (Thorough)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/60 font-mono text-sm mb-2">Result Filtering</label>
            <select className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white font-mono">
              <option value="strict">Strict (High Relevance)</option>
              <option value="balanced">Balanced</option>
              <option value="loose">Loose (More Results)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};