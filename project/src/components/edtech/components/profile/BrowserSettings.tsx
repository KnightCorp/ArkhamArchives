import React from 'react';
import { Lock, Bookmark, Shield, Upload, Crown, Eye, Info } from 'lucide-react';

export const BrowserSettings = () => {
  return (
    <div className="space-y-8">
      {/* Detective Info */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg text-zinc-200">Detective_01</h2>
            <p className="text-sm text-zinc-400">Active Investigation: #2045</p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-lg text-zinc-200 mb-6">DATA MANAGEMENT</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-zinc-400" />
                <h3 className="text-zinc-200">IMPORT PASSWORDS</h3>
              </div>
              <button className="px-4 py-1 bg-zinc-700 text-zinc-200 rounded hover:bg-zinc-600 transition-colors">
                Import
              </button>
            </div>
            <p className="text-sm text-zinc-400 ml-8">
              Securely import passwords from browsers and password managers
            </p>
          </div>

          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Bookmark className="w-5 h-5 text-zinc-400" />
                <h3 className="text-zinc-200">IMPORT BOOKMARKS</h3>
              </div>
              <button className="px-4 py-1 bg-zinc-700 text-zinc-200 rounded hover:bg-zinc-600 transition-colors">
                Import
              </button>
            </div>
            <p className="text-sm text-zinc-400 ml-8">
              Import bookmarks and browsing history
            </p>
          </div>
        </div>
      </div>

      {/* Pro Access */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg text-zinc-200">PRO ACCESS</h2>
          </div>
          <button className="px-6 py-2 bg-amber-500/10 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors">
            UPGRADE TO PRO
          </button>
        </div>
        <p className="text-zinc-400">
          Unlock advanced investigation tools and premium data sources
        </p>
      </div>

      {/* Privacy & Security */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-lg text-zinc-200 mb-6">PRIVACY & SHARING</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-zinc-400 mb-2">PRIVACY LEVEL</label>
            <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200">
              <option value="high">High Encryption</option>
              <option value="medium">Medium Encryption</option>
              <option value="low">Low Encryption</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 mb-2">PRIVACY MODE</label>
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-zinc-400" />
                <span className="text-zinc-200">Stealth Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <div className="flex items-center space-x-3 mb-6">
          <Info className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg text-zinc-200">SYSTEM INFO</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-zinc-400">Version</span>
            <span className="text-zinc-200">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Last Update</span>
            <span className="text-zinc-200">2 hours ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Storage Used</span>
            <span className="text-zinc-200">1.2 GB / 5 GB</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full">
            <div 
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: '24%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};