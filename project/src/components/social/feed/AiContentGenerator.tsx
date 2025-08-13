import React, { useState } from 'react';
import { ImagePlus, Music, Video, Mic, Wand2, Loader2 } from 'lucide-react';

type ContentType = 'image' | 'music' | 'video' | 'podcast';

interface AiContentGeneratorProps {
  onGenerate: (url: string, type: ContentType) => void;
  onClose: () => void;
}

export const AiContentGenerator = ({ onGenerate, onClose }: AiContentGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<ContentType>('image');
  const [generating, setGenerating] = useState(false);

  const contentTypes = [
    { id: 'image', label: 'Image', icon: ImagePlus },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'podcast', label: 'Podcast', icon: Mic }
  ] as const;

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      let apiUrl = '';
      let requestBody = {};
      
      // Select appropriate API endpoint based on content type
      switch (type) {
        case 'image':
          apiUrl = 'https://spectrum-api-343916782787.us-central1.run.app';
          requestBody = { prompt };
          break;
        case 'music':
          apiUrl = 'https://replicate-music-api-343916782787.us-central1.run.app/';
          requestBody = { prompt };
          break;
        case 'video':
          apiUrl = 'https://replicate-video-api-343916782787.us-central1.run.app';
          requestBody = { prompt };
          break;
        case 'podcast':
          // Using music API for podcast generation for now
          apiUrl = 'https://replicate-music-api-343916782787.us-central1.run.app/';
          requestBody = { prompt, type: 'podcast' };
          break;
        default:
          throw new Error('Unsupported content type');
      }
      
      // Try POST first, then GET if 405 error
      let response;
      
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        // If we get 405, try GET with query parameters
        if (response.status === 405) {
          const queryParams = new URLSearchParams({ prompt }).toString();
          response = await fetch(`${apiUrl}?${queryParams}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      } catch (error) {
        // If POST fails completely, try GET
        const queryParams = new URLSearchParams({ prompt }).toString();
        response = await fetch(`${apiUrl}?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Extract the generated content URL from the API response
      // Adjust this based on your actual API response structure
      const contentUrl = result.url || result.output || result.data?.url || result.image_url;
      
      if (contentUrl) {
        onGenerate(contentUrl, type);
        onClose();
      } else {
        throw new Error('No content URL returned from API');
      }
      
    } catch (error) {
      console.error('Error generating content:', error);
      alert(`Failed to generate ${type}. Please try again.`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-800">
        <h3 className="text-xl text-white mb-4">AI Content Generator</h3>

        <div className="flex space-x-2 mb-4">
          {contentTypes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setType(id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                type === id
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <textarea
          placeholder={`Describe the ${type} you want to generate...`}
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