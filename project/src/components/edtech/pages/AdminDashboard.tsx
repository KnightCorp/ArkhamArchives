import React, { useState } from 'react';
import { Upload, Film, Music, Tag, Info, Save } from 'lucide-react';

const AdminDashboard = () => {
  const [contentType, setContentType] = useState('video');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif text-white mb-8">Content Management</h1>

      {/* Upload Form */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setContentType('video')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 ${
              contentType === 'video'
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            <Film className="w-5 h-5" />
            <span>Video Content</span>
          </button>
          <button
            onClick={() => setContentType('audio')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 ${
              contentType === 'audio'
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            <Music className="w-5 h-5" />
            <span>Audio Content</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-zinc-400 mb-2">Title</label>
            <input
              type="text"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
              placeholder="Enter content title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-400 mb-2">Description</label>
            <textarea
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white h-32"
              placeholder="Enter content description"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-zinc-400 mb-2">Content File</label>
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-4" />
              <p className="text-zinc-400">
                Drag and drop your file here, or{' '}
                <button className="text-white underline">browse</button>
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <label className="block text-zinc-400 mb-2">Tags</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                placeholder="Add tags..."
              />
              <button className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700">
                <Tag className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-zinc-400 mb-2">Additional Information</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                placeholder="Professor/Speaker"
              />
              <input
                type="text"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                placeholder="Department"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Upload Content</span>
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl text-white font-serif mb-6">Recent Uploads</h2>
        <div className="space-y-4">
          {/* Sample content items */}
          <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center space-x-4">
              <Film className="w-5 h-5 text-zinc-400" />
              <div>
                <h3 className="text-white">The Philosophy of Modern Science</h3>
                <p className="text-zinc-400 text-sm">Uploaded 2 hours ago</p>
              </div>
            </div>
            <button className="p-2 text-zinc-400 hover:text-white">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;