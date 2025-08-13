import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';

interface AiImageGeneratorProps {
  onClose: () => void;
  onGenerate: (imageUrl: string) => void;
}

export const AiImageGenerator = ({ onClose, onGenerate }: AiImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  
  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const response = await fetch('https://spectrum-api-343916782787.us-central1.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Extract the generated image URL from the API response
      const imageUrl = result.url || result.output || result.data?.url || result.image_url;
      
      if (imageUrl) {
        onGenerate(imageUrl);
      } else {
        throw new Error('No image URL returned from API');
      }
      
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGenerating(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl text-white mb-4 font-typewriter">AI Image Generator</h3>
        
        <textarea
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32 bg-zinc-800 rounded-lg p-4 text-white placeholder-zinc-500 resize-none border border-zinc-700 focus:border-white/20 focus:ring-0 transition-colors mb-4"
        />
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};