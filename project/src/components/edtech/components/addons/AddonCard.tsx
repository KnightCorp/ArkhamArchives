import React, { useState } from 'react';
import { Download, Check, Info, Play } from 'lucide-react';
import type { Addon } from '../../types/addon';

interface AddonCardProps {
  addon: Addon;
}

export const AddonCard = ({ addon }: AddonCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            {<addon.icon className="w-5 h-5 text-zinc-100" />}
          </div>
          <div>
            <h3 className="text-zinc-100 font-medium">{addon.name}</h3>
            <p className="text-zinc-400 text-sm">{addon.shortDescription}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Media Preview */}
      {addon.media.images.length > 0 && (
        <div className="relative mb-6 rounded-lg overflow-hidden">
          <img
            src={addon.media.images[activeImage]}
            alt=""
            className="w-full aspect-video object-cover"
          />
          {addon.media.video && (
            <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <Play className="w-12 h-12 text-white" />
            </button>
          )}
          {addon.media.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {addon.media.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeImage === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <div className="mb-6 space-y-4">
          <p className="text-zinc-300 text-sm">{addon.description}</p>
          
          {addon.features && addon.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-zinc-200 text-sm font-medium">Features:</h4>
              <ul className="space-y-1">
                {addon.features.map((feature, index) => (
                  <li key={index} className="text-zinc-400 text-sm flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {addon.dependencies && addon.dependencies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-zinc-200 text-sm font-medium">Dependencies:</h4>
              <div className="flex flex-wrap gap-2">
                {addon.dependencies.map((dep, index) => (
                  <span key={index} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-zinc-400 text-sm">
          <span>v{addon.version}</span>
          <span>•</span>
          <span>{addon.size}</span>
        </div>
        
        <button
          onClick={() => {/* Handle installation */}}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            addon.installed
              ? 'bg-zinc-800 text-zinc-400 cursor-default'
              : 'bg-white text-black hover:bg-white/90'
          }`}
          disabled={addon.installed}
        >
          {addon.installed ? (
            <>
              <Check className="w-4 h-4" />
              <span>Installed</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Install</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};