import React from 'react';
import { Smartphone, Download, Play, Book, Star } from 'lucide-react';

export const ExamVisualNovel = () => {
  return (
    <div className="space-y-8">
      {/* App Download Banner */}
      <div className="relative bg-black/50 border border-silver/20 rounded-lg p-8 overflow-hidden">
        <div className="absolute inset-0 clock-grid opacity-5" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl text-silver font-alice">Time Keeper: The Visual Novel</h2>
            <p className="text-silver/70 font-code max-w-xl">
              Experience your exam preparation journey through an immersive visual novel. 
              Download our mobile app to unlock this unique study experience.
            </p>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-black/50 text-silver border border-silver/30 rounded-lg hover:bg-silver/10 transition-all font-code">
                <Download className="w-5 h-5" />
                <span>Download App</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-black/50 text-silver border border-silver/30 rounded-lg hover:bg-silver/10 transition-all font-code">
                <Play className="w-5 h-5" />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <Smartphone className="w-32 h-32 text-silver/30 animate-float" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
          <Book className="w-8 h-8 text-silver/60 mb-4" />
          <h3 className="text-lg text-silver font-alice mb-2">Interactive Stories</h3>
          <p className="text-silver/60 font-code">
            Learn through engaging narratives that adapt to your choices and study style
          </p>
        </div>
        <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
          <Star className="w-8 h-8 text-silver/60 mb-4" />
          <h3 className="text-lg text-silver font-alice mb-2">Achievement System</h3>
          <p className="text-silver/60 font-code">
            Earn badges and unlock special content as you progress through chapters
          </p>
        </div>
        <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
          <Play className="w-8 h-8 text-silver/60 mb-4" />
          <h3 className="text-lg text-silver font-alice mb-2">Mini-Games</h3>
          <p className="text-silver/60 font-code">
            Test your knowledge through engaging puzzle-based learning games
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-black/50 border border-silver/20 rounded-lg p-6">
        <h3 className="text-xl text-silver font-alice mb-6">Story Preview</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=300&h=200&fit=crop'
          ].map((image, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};