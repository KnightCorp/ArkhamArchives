import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, Send, Plus, Trash, Edit, Shield, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  requisitionId: string;
}

const Careers: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead the development of cutting-edge AI systems...',
      requirements: [
        'PhD in Computer Science or related field',
        '5+ years experience in AI/ML',
        'Strong background in neural networks'
      ],
      benefits: [
        'Competitive salary',
        'Remote work options',
        'Health insurance',
        'Stock options'
      ],
      requisitionId: 'AI-2024-001'
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resumeLink: '',
    coverLetter: '',
    requisitionId: '',
    source: ''
  });

  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: '',
    department: '',
    location: '',
    type: '',
    description: '',
    requirements: [],
    benefits: [],
    requisitionId: ''
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          to_email: 'knight@arkhamarchives.net',
          job_title: selectedJob?.title,
          requisition_id: formData.requisitionId,
          source: formData.source,
          ...formData
        },
        'YOUR_PUBLIC_KEY'
      );
      
      alert('Application submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        resumeLink: '',
        coverLetter: '',
        requisitionId: '',
        source: ''
      });
      setSelectedJob(null);
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleAddJob = () => {
    if (newJob.title && newJob.requisitionId) {
      setJobs([...jobs, { ...newJob as Job, id: Date.now().toString() }]);
      setNewJob({
        title: '',
        department: '',
        location: '',
        type: '',
        description: '',
        requirements: [],
        benefits: [],
        requisitionId: ''
      });
      setShowAddJob(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setNewJob(job);
    setShowAddJob(true);
  };

  const handleUpdateJob = () => {
    if (editingJob && newJob.title && newJob.requisitionId) {
      setJobs(jobs.map(job => 
        job.id === editingJob.id ? { ...newJob as Job, id: job.id } : job
      ));
      setNewJob({
        title: '',
        department: '',
        location: '',
        type: '',
        description: '',
        requirements: [],
        benefits: [],
        requisitionId: ''
      });
      setEditingJob(null);
      setShowAddJob(false);
    }
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const sourceOptions = [
    'Job Boards',
    'College Placements',
    'LinkedIn',
    'Internshala',
    'Referral',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-black overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="glass rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-red-500 mr-4" />
              <h2 className="text-3xl font-bold">Career Opportunities</h2>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="cta-button bg-transparent"
                title={isAdmin ? "Exit Admin Mode" : "Enter Admin Mode"}
              >
                <Shield className={`w-5 h-5 ${isAdmin ? 'text-red-500' : 'text-gray-500'}`} />
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingJob(null);
                    setNewJob({
                      title: '',
                      department: '',
                      location: '',
                      type: '',
                      description: '',
                      requirements: [],
                      benefits: [],
                      requisitionId: ''
                    });
                    setShowAddJob(true);
                  }}
                  className="cta-button"
                >
                  <Plus className="w-5 h-5" /> Add New Position
                </button>
              )}
            </div>
          </div>

          {isAdmin && showAddJob && (
            <div className="glass bg-black/40 p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">
                {editingJob ? 'Edit Position' : 'Add New Position'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="auth-input p-2"
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  className="auth-input p-2"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="auth-input p-2"
                />
                <input
                  type="text"
                  placeholder="Type (e.g., Full-time)"
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  className="auth-input p-2"
                />
                <input
                  type="text"
                  placeholder="Requisition ID"
                  value={newJob.requisitionId}
                  onChange={(e) => setNewJob({ ...newJob, requisitionId: e.target.value })}
                  className="auth-input p-2"
                />
              </div>
              <textarea
                placeholder="Job Description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="auth-input p-2 w-full mb-4"
                rows={4}
              />
              <div className="flex gap-4">
                <button 
                  onClick={editingJob ? handleUpdateJob : handleAddJob} 
                  className="cta-button"
                >
                  {editingJob ? 'Update Position' : 'Add Position'} <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    setShowAddJob(false);
                    setEditingJob(null);
                  }} 
                  className="cta-button bg-transparent"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="glass bg-black/40 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={() => handleDeleteJob(job.id)} className="p-2 hover:bg-red-900/20 rounded">
                        <Trash className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEditJob(job)} 
                        className="p-2 hover:bg-white/10 rounded"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {job.type}
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4">{job.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside text-gray-300">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setFormData(prev => ({ ...prev, requisitionId: job.requisitionId }));
                  }}
                  className="cta-button w-full"
                >
                  Apply Now <Send className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a 
              href="/careers" 
              className="cta-button inline-flex items-center gap-2"
            >
              View All Careers <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {selectedJob && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="glass rounded-lg p-8 max-w-2xl w-full my-8">
              <h3 className="text-2xl font-bold mb-6">Apply for {selectedJob.title}</h3>
              
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="auth-input w-full p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="auth-input w-full p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="auth-input w-full p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Requisition ID</label>
                  <input
                    type="text"
                    required
                    value={formData.requisitionId}
                    className="auth-input w-full p-2"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
                  <select
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="auth-input w-full p-2"
                  >
                    <option value="">Select source</option>
                    {sourceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Resume Link</label>
                  <input
                    type="url"
                    required
                    value={formData.resumeLink}
                    onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                    className="auth-input w-full p-2"
                    placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Cover Letter</label>
                  <textarea
                    required
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    className="auth-input w-full p-2"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="cta-button flex-1">
                    Submit Application <Send className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="cta-button flex-1 bg-transparent"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Careers;