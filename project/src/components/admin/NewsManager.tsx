import React, { useState } from 'react';
import { Plus, Trash, Edit, Send } from 'lucide-react';
import { sendNewsletterUpdate, sendInvestorUpdate } from '../../services/emailService';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'investor';
  date: string;
  mediaUrl?: string;
}

const dummySubscribers = ['user1@example.com', 'user2@example.com'];
const dummyInvestors = ['investor1@example.com', 'investor2@example.com'];

const NewsManager: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'New AI Features Released',
      content: 'We\'ve added groundbreaking AI capabilities to our platform.',
      type: 'general',
      date: '2024-03-26',
      mediaUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
    },
    {
      id: '2',
      title: 'Q1 2024 Financial Results',
      content: 'Strong growth in user acquisition and revenue.',
      type: 'investor',
      date: '2024-03-25',
      mediaUrl: 'https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg'
    }
  ]);

  const [newItem, setNewItem] = useState<Partial<NewsItem>>({
    title: '',
    content: '',
    type: 'general',
    mediaUrl: ''
  });

  const handleAddNews = async () => {
    if (newItem.title && newItem.content) {
      const newsItem: NewsItem = {
        id: Date.now().toString(),
        title: newItem.title,
        content: newItem.content,
        type: newItem.type || 'general',
        date: new Date().toISOString().split('T')[0],
        mediaUrl: newItem.mediaUrl
      };

      setNews([newsItem, ...news]);

      // Send notifications
      try {
        if (newsItem.type === 'general') {
          await sendNewsletterUpdate(dummySubscribers, {
            title: newsItem.title,
            content: newsItem.content
          });
        } else {
          await sendInvestorUpdate(dummyInvestors, {
            title: newsItem.title,
            content: newsItem.content,
            metrics: {
              revenue: '$1.2M',
              growth: '25%',
              users: '50K'
            }
          });
        }
        alert('Update sent successfully!');
      } catch (error) {
        alert('Failed to send notifications');
      }

      setNewItem({
        title: '',
        content: '',
        type: 'general',
        mediaUrl: ''
      });
    }
  };

  const handleDelete = (id: string) => {
    setNews(news.filter(item => item.id !== id));
  };

  return (
    <div className="glass p-6 rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add News/Update</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="w-full p-2 bg-black/50 border border-white/10 rounded"
          />
          
          <textarea
            placeholder="Content"
            value={newItem.content}
            onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
            className="w-full p-2 bg-black/50 border border-white/10 rounded"
            rows={4}
          />
          
          <input
            type="url"
            placeholder="Media URL (optional)"
            value={newItem.mediaUrl}
            onChange={(e) => setNewItem({ ...newItem, mediaUrl: e.target.value })}
            className="w-full p-2 bg-black/50 border border-white/10 rounded"
          />
          
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'general' | 'investor' })}
            className="w-full p-2 bg-black/50 border border-white/10 rounded"
          >
            <option value="general">General Update</option>
            <option value="investor">Investor Update</option>
          </select>
          
          <button
            onClick={handleAddNews}
            className="cta-button w-full"
          >
            Add & Send Update <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="glass bg-black/40 p-4 rounded">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.date}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-900/20 rounded"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {item.mediaUrl && (
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            
            <p className="text-gray-300">{item.content}</p>
            
            <div className="mt-2">
              <span className={`inline-block text-xs px-2 py-1 rounded ${
                item.type === 'general' 
                  ? 'bg-blue-900/50 text-blue-200' 
                  : 'bg-green-900/50 text-green-200'
              }`}>
                {item.type === 'general' ? 'General Update' : 'Investor Update'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsManager;