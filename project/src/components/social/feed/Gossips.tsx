import React, { useState } from 'react';
import { Search, ChevronDown, X, Shield, Image, X as XIcon, Paperclip, Filter, Search as SearchIcon, Users, MapPin } from 'lucide-react';

interface Whisper {
  id: string;
  content: string;
  location: string;
  author: string;
  timestamp: string;
  verifications: number;
  developments: number;
  fromFollowed: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export const Gossips = () => {
  const [newWhisper, setNewWhisper] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showAllWhispers, setShowAllWhispers] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const countries = ["Afghanistan", "Albania", "Algeria", /* Add all countries */];

  const whispers: Whisper[] = [
    {
      id: '1',
      content: "Major tech company preparing for unexpected leadership change. Inside sources suggest power struggle between board members.",
      location: 'Silicon Valley',
      author: 'Anonymous Insider',
      timestamp: '2024-03-15T10:30:00Z',
      verifications: 12,
      developments: 5,
      fromFollowed: true,
      media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop' }
      ]
    },
    {
      id: '2',
      content: "Prominent family's art collection reportedly being quietly liquidated. Financial troubles or tax evasion?",
      location: 'New York',
      author: 'Art World Observer',
      timestamp: '2024-03-15T09:15:00Z',
      verifications: 8,
      developments: 3,
      fromFollowed: true
    }
  ];

  const filteredWhispers = whispers
    .filter(whisper => showAllWhispers || whisper.fromFollowed)
    .filter(whisper => selectedLocation === 'all' || whisper.location === selectedLocation)
    .filter(whisper => 
      whisper.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      whisper.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      whisper.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWhisper = () => {
    console.log('Whisper submitted:', { 
      content: newWhisper,
      files: selectedFiles 
    });
    setNewWhisper('');
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-white" />
          <h2 className="text-xl text-white">Anonymous Whispers</h2>
        </div>
        <p className="text-white/70">
          Share and discover anonymous whispers about various happenings. All posts are encrypted and untraceable.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search whispers..."
            className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/30"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Locations</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAllWhispers(!showAllWhispers)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showAllWhispers
                ? 'bg-white/10 text-white'
                : 'bg-white/5 text-white/60'
            }`}
          >
            {showAllWhispers ? 'Show Following Only' : 'Show All Whispers'}
          </button>
        </div>
      </div>

      {/* New Whisper Input */}
      <div className="bg-black/20 border border-white/20 rounded-lg p-6">
        <textarea
          value={newWhisper}
          onChange={(e) => setNewWhisper(e.target.value)}
          placeholder="Share your whisper..."
          className="w-full h-32 bg-black/40 border border-white/20 rounded-lg p-4 text-white placeholder-white/40 resize-none focus:border-white/40 transition-colors"
        />

        {/* Media Preview */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative aspect-square bg-black/40 rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/60">
              <Shield className="w-4 h-4" />
              <span className="text-sm">End-to-end encrypted</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-white/60 hover:text-white"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">Attach files</span>
            </button>
          </div>
          <button
            onClick={handleSubmitWhisper}
            disabled={!newWhisper.trim()}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Whisper
          </button>
        </div>
      </div>

      {/* Whispers Timeline */}
      <div className="space-y-4">
        {filteredWhispers.map((whisper) => (
          <div key={whisper.id} className="bg-black/20 border border-white/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">
                {new Date(whisper.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <p className="text-white mb-4">{whisper.content}</p>

            {/* Media Display */}
            {whisper.media && whisper.media.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {whisper.media.map((item, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-white/60">
                <Users className="w-4 h-4" />
                <span>{whisper.verifications} verifications</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Search className="w-4 h-4" />
                <span>{whisper.developments} developments</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <MapPin className="w-4 h-4" />
                <span>{whisper.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};