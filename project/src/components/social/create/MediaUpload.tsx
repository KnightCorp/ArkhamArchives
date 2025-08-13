import React, { useState } from 'react';
import { ImagePlus, X, Film } from 'lucide-react';

export const MediaUpload = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={preview}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => setPreviews(prev => prev.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
        
        {previews.length < 9 && (
          <label className="aspect-square border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-colors">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <ImagePlus className="w-8 h-8 text-zinc-500 mb-2" />
            <span className="text-sm text-zinc-500">Add media</span>
          </label>
        )}
      </div>
    </div>
  );
};