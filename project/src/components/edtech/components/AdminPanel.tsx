import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Eye, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { Teacher } from '../types';

interface AdminPanelProps {
  pendingTeachers: Teacher[];
  onApproveTeacher: (teacherId: string) => void;
  onRejectTeacher: (teacherId: string) => void;
  onViewTeacher: (teacherId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  pendingTeachers,
  onApproveTeacher,
  onRejectTeacher,
  onViewTeacher
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'analytics' | 'settings'>('pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white subtle-glow mb-2">
          ADMIN_PANEL.<span className="text-green-400">EXE</span>
        </h1>
        <p className="text-white/60">
          MANAGE <span className="text-green-400">PLATFORM</span> OPERATIONS
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="black-glass border border-white/20 flex">
          {[
            { id: 'pending', label: 'PENDING_APPROVALS', icon: Users },
            { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
            { id: 'settings', label: 'SETTINGS', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-400/20 text-green-400 border-r border-green-400/30'
                  : 'text-white/80 hover:text-white border-r border-white/10 last:border-r-0'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pending Teacher Approvals */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <h2 className="text-white text-xl font-bold mb-4">
            TEACHER_APPLICATIONS.<span className="text-green-400">QUEUE</span>
          </h2>
          
          {pendingTeachers.length === 0 ? (
            <div className="black-glass white-glow p-8 text-center">
              <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No pending teacher applications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTeachers.map((teacher) => (
                <div key={teacher.id} className="black-glass white-glow p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Teacher Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                          {teacher.profilePhoto ? (
                            <img 
                              src={teacher.profilePhoto} 
                              alt={teacher.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Users className="w-8 h-8 text-white/60" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{teacher.name}</h3>
                          <p className="text-white/60 text-sm">
                            Applied: {new Date(teacher.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="mb-4">
                        <h4 className="text-white/80 font-bold text-sm mb-2">BIO:</h4>
                        <p className="text-white/70 text-sm">{teacher.bio}</p>
                      </div>

                      {/* Professional Background */}
                      <div className="mb-4">
                        <h4 className="text-white/80 font-bold text-sm mb-2">PROFESSIONAL_BACKGROUND:</h4>
                        <p className="text-white/70 text-sm">{teacher.professionalBackground}</p>
                      </div>

                      {/* Expertise */}
                      <div className="mb-4">
                        <h4 className="text-white/80 font-bold text-sm mb-2">EXPERTISE:</h4>
                        <p className="text-white/70 text-sm">{teacher.expertise}</p>
                      </div>

                      {/* Tags */}
                      <div className="mb-4">
                        <h4 className="text-white/80 font-bold text-sm mb-2">TAGS:</h4>
                        <div className="flex flex-wrap gap-2">
                          {teacher.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-green-400/20 text-green-400 px-2 py-1 text-xs border border-green-400/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      {(teacher.linkedinUrl || teacher.youtubeUrl || teacher.instagramUrl) && (
                        <div className="mb-4">
                          <h4 className="text-white/80 font-bold text-sm mb-2">SOCIAL_LINKS:</h4>
                          <div className="space-y-1 text-sm">
                            {teacher.linkedinUrl && (
                              <div className="text-blue-400">LinkedIn: {teacher.linkedinUrl}</div>
                            )}
                            {teacher.youtubeUrl && (
                              <div className="text-red-400">YouTube: {teacher.youtubeUrl}</div>
                            )}
                            {teacher.instagramUrl && (
                              <div className="text-pink-400">Instagram: {teacher.instagramUrl}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-64 space-y-3">
                      <button
                        onClick={() => onViewTeacher(teacher.id)}
                        className="w-full bg-white/10 text-white py-2 px-4 border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        [VIEW_FULL_PROFILE]
                      </button>
                      
                      <button
                        onClick={() => onApproveTeacher(teacher.id)}
                        className="w-full bg-green-400/20 text-green-400 py-2 px-4 border border-green-400/30 hover:bg-green-400/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        [APPROVE]
                      </button>
                      
                      <button
                        onClick={() => onRejectTeacher(teacher.id)}
                        className="w-full bg-red-400/20 text-red-400 py-2 px-4 border border-red-400/30 hover:bg-red-400/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        [REJECT]
                      </button>
                      
                      <button className="w-full bg-blue-400/20 text-blue-400 py-2 px-4 border border-blue-400/30 hover:bg-blue-400/30 transition-colors flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        [MESSAGE]
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-white text-xl font-bold mb-4">
            PLATFORM_ANALYTICS.<span className="text-green-400">DATA</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'TOTAL_TEACHERS', value: '1,234', change: '+12%' },
              { title: 'TOTAL_STUDENTS', value: '15,678', change: '+8%' },
              { title: 'ACTIVE_CLASSES', value: '456', change: '+15%' },
              { title: 'REVENUE', value: '$89,123', change: '+22%' }
            ].map((stat) => (
              <div key={stat.title} className="black-glass white-glow p-4 text-center">
                <h3 className="text-white/80 text-sm mb-2">{stat.title}</h3>
                <div className="text-white font-bold text-2xl mb-1">{stat.value}</div>
                <div className="text-green-400 text-sm">{stat.change}</div>
              </div>
            ))}
          </div>

          <div className="black-glass white-glow p-6">
            <h3 className="text-white font-bold mb-4">RECENT_ACTIVITY</h3>
            <div className="space-y-3">
              {[
                'New teacher application from John Doe',
                'Class "Advanced React" reached 100 students',
                'Payment processed: $299 from Jane Smith',
                'New student registration: Mike Johnson'
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-black/30 border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white/80 text-sm">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <h2 className="text-white text-xl font-bold mb-4">
            PLATFORM_SETTINGS.<span className="text-green-400">CONFIG</span>
          </h2>
          
          <div className="black-glass white-glow p-6">
            <h3 className="text-white font-bold mb-4">GENERAL_SETTINGS</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Platform Name:</label>
                <input
                  type="text"
                  defaultValue="Neural Academy"
                  className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">Commission Rate (%):</label>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full bg-black/50 border border-white/20 text-white p-3 focus:border-green-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <label className="text-white/80 text-sm">Auto-approve teachers with verified credentials</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <label className="text-white/80 text-sm">Enable AI homework evaluation</label>
              </div>
            </div>
          </div>

          <div className="black-glass white-glow p-6">
            <h3 className="text-white font-bold mb-4">NOTIFICATION_SETTINGS</h3>
            <div className="space-y-3">
              {[
                'New teacher applications',
                'Class enrollments',
                'Payment notifications',
                'System alerts'
              ].map((setting) => (
                <div key={setting} className="flex items-center justify-between">
                  <span className="text-white/80">{setting}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;