import React from "react";
import { Addon } from "./types";
import { Download, Check } from "lucide-react";

export interface AddonCardProps {
  addon: Addon;
  onInstall?: (id: string) => void;
}

export const AddonCard: React.FC<AddonCardProps> = ({ addon, onInstall }) => {
  const {
    id,
    name,
    shortDescription,
    description,
    icon: Icon,
    installed,
    version,
    size,
    features,
    author,
    rating,
  } = addon;

  const handleInstall = () => {
    if (onInstall) {
      onInstall(id);
    }
  };

  return (
    <div className="border border-zinc-800 rounded-lg p-5 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="bg-zinc-800 p-2 rounded-lg mr-3">
            <Icon className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-zinc-200 font-medium">{name}</h3>
            <p className="text-zinc-400 text-sm">{shortDescription}</p>
          </div>
        </div>
        <div className="flex items-center">
          {installed ? (
            <span className="flex items-center text-emerald-500 text-xs">
              <Check className="w-3 h-3 mr-1" />
              Installed
            </span>
          ) : (
            <button
              onClick={handleInstall}
              className="flex items-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded text-xs transition-colors"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
            </button>
          )}
        </div>
      </div>

      <p className="text-zinc-400 text-sm mb-4">{description}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-xs">
          <span className="text-zinc-500">Version:</span>
          <span className="text-zinc-300 ml-1">{version}</span>
        </div>
        <div className="text-xs">
          <span className="text-zinc-500">Size:</span>
          <span className="text-zinc-300 ml-1">{size}</span>
        </div>
        <div className="text-xs">
          <span className="text-zinc-500">Author:</span>
          <span className="text-zinc-300 ml-1">{author}</span>
        </div>
        {rating && (
          <div className="text-xs">
            <span className="text-zinc-500">Rating:</span>
            <span className="text-zinc-300 ml-1">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-zinc-400 text-xs mb-2">Features</h4>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
