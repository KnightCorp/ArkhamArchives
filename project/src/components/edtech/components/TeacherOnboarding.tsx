import React, { useState } from 'react';
import { User, Camera, Link, Youtube, Linkedin, Instagram, Save, X } from 'lucide-react';

interface TeacherOnboardingProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TeacherOnboarding: React.FC<TeacherOnboardingProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    professionalBackground: '',
    tags: [] as string[],
    expertise: '',
    linkedinUrl: '',
    youtubeUrl: '',
    instagramUrl: ''
  });

  const [newTag, setNewTag] = useState('');

  const popularTags = [
    'AI', 'Machine Learning', 'Product Development', 'Corporate Finance',
    'Web Development', 'Data Science', 'UX/UI Design', 'Digital Marketing',
    'Blockchain', 'Cybersecurity', 'Cloud Computing', 'Mobile Development'
  ];

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="black-glass max-w-2xl w-full white-glow-strong max-h-[90vh] overflow-y-auto">
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-bold subtle-glow">
              TEACHER_ONBOARDING.<span className="text-green-400">EXE</span>
            </h2>
            <button 
              onClick={onCancel}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-white/60" />
            </div>
            <button type="button" className="text-green-400 text-sm hover:text-green-300">
              [UPLOAD_PHOTO]
            </button>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">NAME</span>:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">BIO</span>:
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none h-24 resize-none"
                placeholder="Brief bio about yourself"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">PROFESSIONAL_BACKGROUND</span>:
              </label>
              <textarea
                value={formData.professionalBackground}
                onChange={(e) => setFormData(prev => ({ ...prev, professionalBackground: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none h-32 resize-none"
                placeholder="Describe your professional experience, education, and achievements"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">EXPERTISE_DESCRIPTION</span>:
              </label>
              <textarea
                value={formData.expertise}
                onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none h-24 resize-none"
                placeholder="What specific topics and skills do you teach?"
                required
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              <span className="text-green-400">EXPERTISE_TAGS</span>:
            </label>
            
            {/* Current Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-400/20 text-green-400 px-2 py-1 text-xs border border-green-400/30 flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-green-400/80 hover:text-green-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Tag */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                placeholder="Add custom tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
              />
              <button
                type="button"
                onClick={() => addTag(newTag)}
                className="bg-green-400/20 text-green-400 px-3 py-2 text-sm border border-green-400/30 hover:bg-green-400/30"
              >
                ADD
              </button>
            </div>

            {/* Popular Tags */}
            <div>
              <p className="text-white/60 text-xs mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className={`px-2 py-1 text-xs border transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-green-400/20 text-green-400 border-green-400/30'
                        : 'bg-white/10 text-white/80 border-white/20 hover:border-green-400/50'
                    }`}
                    disabled={formData.tags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm">
              <span className="text-green-400">SOCIAL_LINKS</span> (Optional):
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-blue-400" />
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="flex-1 bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  placeholder="LinkedIn profile URL"
                />
              </div>

              <div className="flex items-center gap-3">
                <Youtube className="w-5 h-5 text-red-400" />
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  className="flex-1 bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  placeholder="YouTube channel URL"
                />
              </div>

              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-pink-400" />
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                  className="flex-1 bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  placeholder="Instagram profile URL"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/10 text-white py-3 px-4 border border-white/20 hover:bg-white/20 transition-colors"
            >
              [CANCEL]
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-400/20 text-green-400 py-3 px-4 border border-green-400/30 hover:bg-green-400/30 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              [SUBMIT_FOR_APPROVAL]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherOnboarding;