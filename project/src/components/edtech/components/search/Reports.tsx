import React from 'react';
import { FileText, Clock, User, Tag, FileSpreadsheet, Gavel, UserX, BarChart2, Newspaper } from 'lucide-react';

const reportTemplates = [
  {
    id: 'financial',
    title: 'Financial Report',
    icon: FileSpreadsheet,
    sections: ['Transaction Analysis', 'Asset Tracking', 'Financial Patterns']
  },
  {
    id: 'legal',
    title: 'Legal Brief',
    icon: Gavel,
    sections: ['Case Summary', 'Legal Arguments', 'Evidence List']
  },
  {
    id: 'criminal',
    title: 'Criminal Report',
    icon: UserX,
    sections: ['Suspect Profile', 'Crime Details', 'Evidence Collection']
  },
  {
    id: 'business',
    title: 'Business Analysis',
    icon: BarChart2,
    sections: ['Market Overview', 'Competitive Analysis', 'Risk Assessment']
  },
  {
    id: 'news',
    title: 'News Article',
    icon: Newspaper,
    sections: ['Event Summary', 'Witness Accounts', 'Background Context']
  }
];

const reports = [
  {
    id: 1,
    title: 'Initial Investigation Report',
    type: 'Field Report',
    author: 'Det. Sarah Chen',
    date: '2024-03-15',
    status: 'Complete',
    tags: ['Priority', 'Field Work', 'Evidence']
  },
  {
    id: 2,
    title: 'Forensic Analysis Results',
    type: 'Lab Report',
    author: 'Dr. James Wilson',
    date: '2024-03-14',
    status: 'Pending Review',
    tags: ['Lab Work', 'DNA', 'Urgent']
  },
  {
    id: 3,
    title: 'Witness Interview Transcripts',
    type: 'Interview Report',
    author: 'Det. Michael Torres',
    date: '2024-03-13',
    status: 'In Progress',
    tags: ['Interviews', 'Witnesses']
  }
];

export const Reports = () => (
  <div className="space-y-6">
    {/* Report Templates */}
    <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-white/70" />
          <h3 className="text-lg text-white font-mono tracking-wide">REPORT TEMPLATES</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTemplates.map((template) => (
          <div 
            key={template.id}
            className="p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-3">
              <template.icon className="w-5 h-5 text-white/70" />
              <h4 className="text-white font-mono">{template.title}</h4>
            </div>
            <div className="space-y-2">
              {template.sections.map((section) => (
                <div 
                  key={section}
                  className="text-white/60 text-sm font-mono pl-3 border-l border-white/10"
                >
                  {section}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Report Creation */}
    <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-white/70" />
          <h3 className="text-lg text-white font-mono tracking-wide">CASE REPORTS</h3>
        </div>
        <button className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-mono tracking-wide">
          New Report
        </button>
      </div>
    </div>

    {/* Reports List */}
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-mono">{report.title}</h4>
            <span className={`px-3 py-1 rounded-full text-xs font-mono ${
              report.status === 'Complete' ? 'bg-emerald-500/20 text-emerald-400' :
              report.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {report.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-white/60">
              <User className="w-4 h-4" />
              <span className="text-sm">{report.author}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{report.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Tag className="w-4 h-4" />
              <span className="text-sm">{report.type}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {report.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-white/5 text-white/60 rounded text-xs font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);