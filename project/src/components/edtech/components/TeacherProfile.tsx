import React from 'react';
import { Star, Users, BookOpen, Calendar, Linkedin, Youtube, Instagram, MessageCircle, Heart, Share2 } from 'lucide-react';
import { Teacher } from '../types';

interface TeacherProfileProps {
  teacher: Teacher;
  onFollow: (teacherId: string) => void;
  onMessage: (teacherId: string) => void;
  isFollowing: boolean;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ 
  teacher, 
  onFollow, 
  onMessage, 
  isFollowing 
}) => {
  return (
    <div className="black-glass white-glow-strong max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Photo */}
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto md:mx-0">
            {teacher.profilePhoto ? (
              <img 
                src={teacher.profilePhoto} 
                alt={teacher.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Users className="w-16 h-16 text-white/60" />
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white subtle-glow mb-2">
              {teacher.name}
            </h1>
            
            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <div className="text-white font-bold">{teacher.rating.toFixed(1)}</div>
                <div className="text-white/60 text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  RATING
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{teacher.totalStudents}</div>
                <div className="text-white/60 text-xs">STUDENTS</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">{teacher.totalClasses}</div>
                <div className="text-white/60 text-xs">CLASSES</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {teacher.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-400/20 text-green-400 px-2 py-1 text-xs border border-green-400/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center md:justify-start gap-3">
              <button
                onClick={() => onFollow(teacher.id)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  isFollowing
                    ? 'bg-green-400/20 text-green-400 border-green-400/30'
                    : 'bg-white/10 text-white border-white/20 hover:border-green-400/50'
                }`}
              >
                {isFollowing ? '[FOLLOWING]' : '[FOLLOW]'}
              </button>
              <button
                onClick={() => onMessage(teacher.id)}
                className="px-4 py-2 text-sm bg-white/10 text-white border border-white/20 hover:border-green-400/50 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                [MESSAGE]
              </button>
              <button className="px-4 py-2 text-sm bg-white/10 text-white border border-white/20 hover:border-green-400/50 transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                [SHARE]
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Bio */}
        <div>
          <h2 className="text-white font-bold mb-3">
            <span className="text-green-400">BIO</span>:
          </h2>
          <p className="text-white/80 leading-relaxed">{teacher.bio}</p>
        </div>

        {/* Professional Background */}
        <div>
          <h2 className="text-white font-bold mb-3">
            <span className="text-green-400">PROFESSIONAL_BACKGROUND</span>:
          </h2>
          <p className="text-white/80 leading-relaxed">{teacher.professionalBackground}</p>
        </div>

        {/* Expertise */}
        <div>
          <h2 className="text-white font-bold mb-3">
            <span className="text-green-400">EXPERTISE</span>:
          </h2>
          <p className="text-white/80 leading-relaxed">{teacher.expertise}</p>
        </div>

        {/* Social Links */}
        {(teacher.linkedinUrl || teacher.youtubeUrl || teacher.instagramUrl) && (
          <div>
            <h2 className="text-white font-bold mb-3">
              <span className="text-green-400">SOCIAL_LINKS</span>:
            </h2>
            <div className="flex gap-4">
              {teacher.linkedinUrl && (
                <a
                  href={teacher.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              )}
              {teacher.youtubeUrl && (
                <a
                  href={teacher.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  YouTube
                </a>
              )}
              {teacher.instagramUrl && (
                <a
                  href={teacher.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h2 className="text-white font-bold mb-3">
            <span className="text-green-400">RECENT_ACTIVITY</span>:
          </h2>
          <div className="space-y-3">
            {[
              { type: 'class', content: 'Created new class: Advanced React Patterns', time: '2 hours ago' },
              { type: 'milestone', content: 'Reached 500 students milestone!', time: '1 day ago' },
              { type: 'achievement', content: 'Completed 100 classes', time: '3 days ago' }
            ].map((activity, index) => (
              <div key={index} className="black-glass border border-white/10 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activity.type === 'class' && <BookOpen className="w-4 h-4 text-green-400" />}
                    {activity.type === 'milestone' && <Star className="w-4 h-4 text-yellow-400" />}
                    {activity.type === 'achievement' && <Calendar className="w-4 h-4 text-blue-400" />}
                    <span className="text-white/80 text-sm">{activity.content}</span>
                  </div>
                  <span className="text-white/60 text-xs">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;