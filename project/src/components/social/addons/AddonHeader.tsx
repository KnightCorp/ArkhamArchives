import React from 'react';
import { Package } from 'lucide-react';

export const AddonHeader = () => (
  <div className="border-b border-zinc-800 pb-8 mb-8">
    <div className="flex items-center space-x-3 mb-4">
      <Package className="w-8 h-8 text-zinc-400" />
      <h1 className="text-3xl text-zinc-200 font-mono tracking-wide">Add-on Modules</h1>
    </div>
    <p className="text-zinc-400 max-w-3xl">
      Enhance your investigation capabilities with specialized modules. Each add-on is carefully crafted to extend your toolkit with advanced features and integrations.
    </p>
  </div>
);