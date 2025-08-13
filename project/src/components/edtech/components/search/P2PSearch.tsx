import React, { useState } from 'react';
import { Share2, Download, Upload, Search, FileText } from 'lucide-react';

const mockFiles = [
  { id: 1, name: 'Case Report 2045.pdf', size: '2.4 MB', peers: 12, type: 'document' },
  { id: 2, name: 'Evidence Photos.zip', size: '156 MB', peers: 8, type: 'archive' },
  { id: 3, name: 'Witness Statements.doc', size: '1.2 MB', peers: 15, type: 'document' },
  { id: 4, name: 'Crime Scene Analysis.pdf', size: '5.6 MB', peers: 6, type: 'document' }
];

export const P2PSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH P2P NETWORK"
          className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono tracking-wide"
        />
      </div>

      {/* Upload Section */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Upload className="w-5 h-5 text-white/70" />
            <h3 className="text-lg text-white font-mono tracking-wide">SHARE FILES</h3>
          </div>
          <button className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-mono tracking-wide">
            Upload Files
          </button>
        </div>
        <p className="text-white/50 font-mono text-sm">
          Share investigation files securely through the P2P network
        </p>
      </div>

      {/* Available Files */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Share2 className="w-5 h-5 text-white/70" />
          <h3 className="text-lg text-white font-mono tracking-wide">AVAILABLE FILES</h3>
        </div>

        <div className="space-y-4">
          {mockFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
              <div className="flex items-center space-x-4">
                <FileText className="w-5 h-5 text-white/70" />
                <div>
                  <p className="text-white font-mono">{file.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-white/50 text-sm">{file.size}</span>
                    <span className="text-white/50 text-sm">{file.peers} peers</span>
                  </div>
                </div>
              </div>
              <button className="p-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};