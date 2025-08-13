import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, BookOpen, Brain, Zap, X, Plus, Trash2 } from 'lucide-react';

interface ClassCreationProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ClassCreation: React.FC<ClassCreationProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    description: '',
    dateTime: '',
    price: 0,
    priceType: 'session' as 'session' | 'monthly',
    topicsCovered: [''],
    maxStudents: 50,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: [] as string[],
    enableLive: true,
    homework: {
      enabled: false,
      title: '',
      description: '',
      questions: [{ question: '', type: 'text', points: 10 }],
      xpReward: 50,
      dueDate: ''
    },
    quiz: {
      enabled: false,
      title: '',
      questions: [{ question: '', type: 'multiple-choice', options: ['', '', '', ''], correctAnswer: '', points: 5 }],
      xpReward: 30,
      timeLimit: 30
    }
  });

  const [newTag, setNewTag] = useState('');

  const addTopicField = () => {
    setFormData(prev => ({
      ...prev,
      topicsCovered: [...prev.topicsCovered, '']
    }));
  };

  const updateTopic = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      topicsCovered: prev.topicsCovered.map((topic, i) => i === index ? value : topic)
    }));
  };

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topicsCovered: prev.topicsCovered.filter((_, i) => i !== index)
    }));
  };

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

  const addHomeworkQuestion = () => {
    setFormData(prev => ({
      ...prev,
      homework: {
        ...prev.homework,
        questions: [...prev.homework.questions, { question: '', type: 'text', points: 10 }]
      }
    }));
  };

  const addQuizQuestion = () => {
    setFormData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: [...prev.quiz.questions, { 
          question: '', 
          type: 'multiple-choice', 
          options: ['', '', '', ''], 
          correctAnswer: '', 
          points: 5 
        }]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="black-glass max-w-4xl w-full white-glow-strong max-h-[90vh] overflow-y-auto">
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-bold subtle-glow">
              CREATE_CLASS.<span className="text-green-400">EXE</span>
            </h2>
            <button onClick={onCancel} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">CLASS_TITLE</span>:
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                placeholder="Enter class title"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">TOPIC</span>:
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                placeholder="Main topic"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">
              <span className="text-green-400">DESCRIPTION</span>:
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none h-24 resize-none"
              placeholder="Detailed class description"
              required
            />
          </div>

          {/* Schedule & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                <span className="text-green-400">DATE_TIME</span>:
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                <span className="text-green-400">PRICE</span>:
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">PRICE_TYPE</span>:
              </label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData(prev => ({ ...prev, priceType: e.target.value as 'session' | 'monthly' }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
              >
                <option value="session">Per Session</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">DIFFICULTY</span>:
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                <span className="text-green-400">MAX_STUDENTS</span>:
              </label>
              <input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: Number(e.target.value) }))}
                className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                min="1"
                max="500"
              />
            </div>
          </div>

          {/* Topics Covered */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              <span className="text-green-400">TOPICS_COVERED</span>:
            </label>
            <div className="space-y-2">
              {formData.topicsCovered.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                    placeholder={`Topic ${index + 1}`}
                  />
                  {formData.topicsCovered.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTopicField}
                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Topic
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              <span className="text-green-400">TAGS</span>:
            </label>
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
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                placeholder="Add tag"
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
          </div>

          {/* Homework Section */}
          <div className="border border-white/20 p-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.homework.enabled}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  homework: { ...prev.homework, enabled: e.target.checked }
                }))}
                className="w-4 h-4"
              />
              <Brain className="w-4 h-4 text-green-400" />
              <span className="text-white font-bold">
                <span className="text-green-400">AI_HOMEWORK</span>
              </span>
            </div>

            {formData.homework.enabled && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.homework.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    homework: { ...prev.homework, title: e.target.value }
                  }))}
                  className="w-full bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  placeholder="Homework title"
                />
                <textarea
                  value={formData.homework.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    homework: { ...prev.homework, description: e.target.value }
                  }))}
                  className="w-full bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none h-20 resize-none"
                  placeholder="Homework description"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={formData.homework.xpReward}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      homework: { ...prev.homework, xpReward: Number(e.target.value) }
                    }))}
                    className="bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                    placeholder="XP Reward"
                    min="0"
                  />
                  <input
                    type="datetime-local"
                    value={formData.homework.dueDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      homework: { ...prev.homework, dueDate: e.target.value }
                    }))}
                    className="bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quiz Section */}
          <div className="border border-white/20 p-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.quiz.enabled}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  quiz: { ...prev.quiz, enabled: e.target.checked }
                }))}
                className="w-4 h-4"
              />
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-white font-bold">
                <span className="text-green-400">AI_QUIZ</span>
              </span>
            </div>

            {formData.quiz.enabled && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.quiz.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    quiz: { ...prev.quiz, title: e.target.value }
                  }))}
                  className="w-full bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                  placeholder="Quiz title"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={formData.quiz.xpReward}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      quiz: { ...prev.quiz, xpReward: Number(e.target.value) }
                    }))}
                    className="bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                    placeholder="XP Reward"
                    min="0"
                  />
                  <input
                    type="number"
                    value={formData.quiz.timeLimit}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      quiz: { ...prev.quiz, timeLimit: Number(e.target.value) }
                    }))}
                    className="bg-black/50 border border-white/20 text-white p-2 text-sm focus:border-green-400 focus:outline-none"
                    placeholder="Time limit (minutes)"
                    min="1"
                  />
                </div>
              </div>
            )}
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
              className="flex-1 bg-green-400/20 text-green-400 py-3 px-4 border border-green-400/30 hover:bg-green-400/30 transition-colors"
            >
              [CREATE_CLASS]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassCreation;