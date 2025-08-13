import React, { useState } from 'react';
import { ImagePlus, MapPin, Wand2 } from 'lucide-react';
import { MediaUpload } from './MediaUpload';
import { LocationPicker } from './LocationPicker';
import { AiImageGenerator } from './AiImageGenerator';

export const CreatePost = () => {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-lg p-6 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] mb-8">
      <textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-32 bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white placeholder-white/30 resize-none border border-white/10 focus:border-white/20 focus:ring-0 transition-colors"
      />
      
      <MediaUpload />
      
      <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowLocationPicker(true)}
            className="flex items-center space-x-2 text-white/40 hover:text-white transition-colors"
          >
            <MapPin className="w-5 h-5" />
            <span>Add location</span>
          </button>
          
          <button
            onClick={() => setShowAiGenerator(true)}
            className="flex items-center space-x-2 text-white/40 hover:text-white transition-colors"
          >
            <Wand2 className="w-5 h-5" />
            <span>AI Generate</span>
          </button>
        </div>
        
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors">
          Post
        </button>
      </div>
      
      {showLocationPicker && (
        <LocationPicker
          onClose={() => setShowLocationPicker(false)}
          onSelect={(loc) => {
            setLocation(loc);
            setShowLocationPicker(false);
          }}
        />
      )}
      
      {showAiGenerator && (
        <AiImageGenerator
          onClose={() => setShowAiGenerator(false)}
          onGenerate={(image) => {
            setShowAiGenerator(false);
          }}
        />
      )}
    </div>
  );
};