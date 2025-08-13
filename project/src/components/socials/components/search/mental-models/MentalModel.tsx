import React from 'react';
import { Brain } from 'lucide-react';

interface Example {
  text: string;
}

interface MentalModelProps {
  title: string;
  description: string;
  applications: string[];
  examples: Example[];
}

export const MentalModel = ({ title, description, applications, examples }: MentalModelProps) => (
  <div className="bg-black/80 border-2 border-bat-red/30 rounded-lg p-6 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all">
    <div className="flex items-center space-x-3 mb-4">
      <Brain className="w-5 h-5 text-bat-red/70" />
      <h3 className="text-lg text-white font-bold tracking-wider uppercase">{title}</h3>
    </div>
    
    <p className="text-white/60 font-montserrat text-sm mb-6">{description}</p>
    
    <div className="space-y-6">
      <div>
        <h4 className="text-white font-bold tracking-wider uppercase text-sm mb-2">APPLICATIONS</h4>
        <ul className="space-y-1">
          {applications.map((app, index) => (
            <li 
              key={index}
              className="text-white/60 font-montserrat text-sm pl-4 border-l-2 border-bat-red/20"
            >
              {app}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="text-white font-bold tracking-wider uppercase text-sm mb-2">EXAMPLES</h4>
        <ul className="space-y-1">
          {examples.map((example, index) => (
            <li 
              key={index}
              className="text-white/60 font-montserrat text-sm pl-4 border-l-2 border-bat-red/20"
            >
              {example.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);