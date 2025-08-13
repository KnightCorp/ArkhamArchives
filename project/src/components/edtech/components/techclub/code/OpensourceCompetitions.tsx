import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Clock, 
  Star, 
  Users, 
  Trophy, 
  Calendar,
  ArrowLeft,
  ExternalLink,
  Code2,
  Target,
  CheckCircle2,
  GitCommit,
  GitPullRequest,
  Award,
  TrendingUp
} from 'lucide-react';

interface OpensourceProject {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER';
  technologies: string[];
  xpReward: number;
  deadline: Date;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  imageUrl: string;
  githubUrl: string;
  requirements: string[];
  currentContributions: number;
  targetContributions: number;
}

interface Contributor {
  id: string;
  username: string;
  avatar: string;
  contributions: number;
  xpEarned: number;
  rank: number;
  joinedDate: Date;
  lastActivity: Date;
}

interface OpensourceCompetitionsProps {
  onBack: () => void;
}

const opensourceProjects: OpensourceProject[] = [
  {
    id: 'neural-ui',
    title: 'NEURAL_UI.FRAMEWORK',
    description: 'BUILD A MODERN COMPONENT LIBRARY FOR NEURAL INTERFACES',
    theme: 'Q1 2025 - UI/UX REVOLUTION',
    difficulty: 'APPRENTICE',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
    xpReward: 2500,
    deadline: new Date('2025-03-31'),
    participants: 47,
    maxParticipants: 100,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
    githubUrl: 'https://github.com/neural-academy/neural-ui',
    requirements: [
      'CREATE REUSABLE REACT COMPONENTS',
      'IMPLEMENT ACCESSIBILITY FEATURES',
      'WRITE COMPREHENSIVE DOCUMENTATION',
      'ADD UNIT TESTS FOR ALL COMPONENTS'
    ],
    currentContributions: 156,
    targetContributions: 300
  },
  {
    id: 'quantum-algorithms',
    title: 'QUANTUM_ALGORITHMS.LIB',
    description: 'IMPLEMENT QUANTUM COMPUTING ALGORITHMS IN PYTHON',
    theme: 'Q1 2025 - QUANTUM COMPUTING',
    difficulty: 'MASTER',
    technologies: ['Python', 'Qiskit', 'NumPy', 'Jupyter'],
    xpReward: 5000,
    deadline: new Date('2025-03-15'),
    participants: 23,
    maxParticipants: 50,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
    githubUrl: 'https://github.com/neural-academy/quantum-algorithms',
    requirements: [
      'IMPLEMENT QUANTUM ALGORITHMS',
      'CREATE EDUCATIONAL NOTEBOOKS',
      'OPTIMIZE PERFORMANCE',
      'PEER REVIEW CODE SUBMISSIONS'
    ],
    currentContributions: 89,
    targetContributions: 200
  },
  {
    id: 'blockchain-explorer',
    title: 'BLOCKCHAIN_EXPLORER.APP',
    description: 'DEVELOP A REAL-TIME BLOCKCHAIN TRANSACTION EXPLORER',
    theme: 'Q2 2025 - DECENTRALIZED WEB',
    difficulty: 'EXPERT',
    technologies: ['Node.js', 'React', 'Web3.js', 'MongoDB'],
    xpReward: 3500,
    deadline: new Date('2025-06-30'),
    participants: 12,
    maxParticipants: 75,
    status: 'upcoming',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    githubUrl: 'https://github.com/neural-academy/blockchain-explorer',
    requirements: [
      'BUILD REAL-TIME TRANSACTION VIEWER',
      'IMPLEMENT WALLET INTEGRATION',
      'CREATE ANALYTICS DASHBOARD',
      'ENSURE SECURITY BEST PRACTICES'
    ],
    currentContributions: 0,
    targetContributions: 250
  },
  {
    id: 'ai-code-assistant',
    title: 'AI_CODE_ASSISTANT.BOT',
    description: 'CREATE AN AI-POWERED CODE REVIEW AND SUGGESTION TOOL',
    theme: 'Q1 2025 - AI DEVELOPMENT TOOLS',
    difficulty: 'EXPERT',
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
    xpReward: 4000,
    deadline: new Date('2025-04-15'),
    participants: 34,
    maxParticipants: 60,
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400',
    githubUrl: 'https://github.com/neural-academy/ai-code-assistant',
    requirements: [
      'TRAIN CODE ANALYSIS MODELS',
      'BUILD API ENDPOINTS',
      'CREATE VS CODE EXTENSION',
      'IMPLEMENT FEEDBACK SYSTEM'
    ],
    currentContributions: 203,
    targetContributions: 400
  }
];

const topContributors: Contributor[] = [
  {
    id: '1',
    username: 'QUANTUM_CODER',
    avatar: '🤖',
    contributions: 89,
    xpEarned: 12500,
    rank: 1,
    joinedDate: new Date('2024-12-01'),
    lastActivity: new Date()
  },
  {
    id: '2',
    username: 'NEURAL_ARCHITECT',
    avatar: '🧠',
    contributions: 76,
    xpEarned: 10200,
    rank: 2,
    joinedDate: new Date('2024-11-15'),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '3',
    username: 'CODE_ALCHEMIST',
    avatar: '⚗️',
    contributions: 64,
    xpEarned: 8900,
    rank: 3,
    joinedDate: new Date('2024-12-10'),
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  {
    id: '4',
    username: 'BLOCKCHAIN_SAGE',
    avatar: '🔗',
    contributions: 52,
    xpEarned: 7300,
    rank: 4,
    joinedDate: new Date('2024-11-20'),
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '5',
    username: 'MATRIX_BUILDER',
    avatar: '🏗️',
    contributions: 41,
    xpEarned: 5800,
    rank: 5,
    joinedDate: new Date('2024-12-05'),
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];

const OpensourceCompetitions: React.FC<OpensourceCompetitionsProps> = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState<OpensourceProject | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'leaderboard' | 'contributions'>('projects');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}D ${hours}H`;
    }
    return `${hours}H`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400/30';
      case 'upcoming': return 'text-white/60 border-white/30';
      case 'completed': return 'text-white/40 border-white/20';
      default: return 'text-white/60 border-white/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'NOVICE': return 'border-green-400/30 text-green-400';
      case 'APPRENTICE': return 'border-white/30 text-white';
      case 'EXPERT': return 'border-white/50 text-white';
      case 'MASTER': return 'border-white/70 text-white';
      default: return 'border-white/30 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <style jsx>{`
        .subtle-glow {
          text-shadow: 0 0 2px rgba(0, 255, 65, 0.3);
        }
        .black-glass {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .opensource-glow {
          box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
        }
        .card-image {
          filter: grayscale(100%) contrast(1.2) brightness(0.8);
          opacity: 0.6;
        }
        .white-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.05);
        }
        .white-glow-strong {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 black-glass">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">BACK</span>
              </button>
              <div className="flex items-center space-x-2">
                <GitBranch className="w-6 h-6 text-green-400 opensource-glow" />
                <span className="text-white subtle-glow font-bold">OPENSOURCE_COMPETITIONS.EXE</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white/60" />
                <span className="text-white/60">Q1 2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-white/60" />
                <span className="text-white/60">{opensourceProjects.reduce((sum, p) => sum + p.participants, 0)} CONTRIBUTORS</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-white/60" />
                <span className="text-white/60">{opensourceProjects.filter(p => p.status === 'active').length} ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 black-glass">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                activeTab === 'projects' 
                  ? 'text-white border-green-400' 
                  : 'text-white/60 border-transparent hover:text-white/80'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>ACTIVE_PROJECTS</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                activeTab === 'leaderboard' 
                  ? 'text-white border-green-400' 
                  : 'text-white/60 border-transparent hover:text-white/80'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>GLOBAL_LEADERBOARD</span>
            </button>
            <button
              onClick={() => setActiveTab('contributions')}
              className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors border-b-2 ${
                activeTab === 'contributions' 
                  ? 'text-white border-green-400' 
                  : 'text-white/60 border-transparent hover:text-white/80'
              }`}
            >
              <GitCommit className="w-4 h-4" />
              <span>MY_CONTRIBUTIONS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'projects' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white subtle-glow mb-2">OPENSOURCE COMPETITIONS</h1>
              <p className="text-white/60">CONTRIBUTE TO REAL PROJECTS. EARN XP. BUILD YOUR PORTFOLIO.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opensourceProjects.map((project) => (
                <div
                  key={project.id}
                  className="relative black-glass p-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden white-glow hover:white-glow-strong"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 card-image"
                    style={{
                      backgroundImage: `url(${project.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/70" />
                  
                  {/* Content */}
                  <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white subtle-glow">{project.title}</h3>
                      <span className={`px-2 py-1 text-xs font-bold border ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Theme */}
                    <div className="mb-3">
                      <span className="text-green-400 text-sm font-bold">{project.theme}</span>
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-sm mb-4">{project.description}</p>

                    {/* Technologies */}
                    <div className="mb-4">
                      <div className="text-white/60 text-xs mb-2">TECH STACK:</div>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech}
                            className="text-xs px-2 py-1 border border-white/20 bg-white/5 text-white/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-white/60 text-xs">DIFFICULTY:</div>
                        <span className={`text-xs font-bold border px-1 py-0.5 ${getDifficultyColor(project.difficulty)}`}>
                          {project.difficulty}
                        </span>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">XP REWARD:</div>
                        <div className="text-white font-bold">{project.xpReward.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">PARTICIPANTS:</div>
                        <div className="text-white">{project.participants}/{project.maxParticipants}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">DEADLINE:</div>
                        <div className="text-white">{formatTimeRemaining(project.deadline)}</div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/60 text-xs">PROGRESS:</span>
                        <span className="text-white/80 text-xs">
                          {project.currentContributions}/{project.targetContributions}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-2">
                        <div 
                          className="bg-green-400 h-2 transition-all duration-500"
                          style={{ width: `${(project.currentContributions / project.targetContributions) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full black-glass border border-white/20 text-white font-bold py-2 px-4 hover:white-glow transition-all subtle-glow">
                      [<span className="text-green-400">VIEW</span>_PROJECT_DETAILS]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white subtle-glow mb-2">GLOBAL LEADERBOARD</h2>
              <p className="text-white/60">TOP CONTRIBUTORS ACROSS ALL OPENSOURCE PROJECTS</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Contributors */}
              <div className="lg:col-span-2">
                <div className="black-glass p-6 white-glow">
                  <h3 className="text-white font-bold mb-4 subtle-glow">TOP CONTRIBUTORS</h3>
                  <div className="space-y-3">
                    {topContributors.map((contributor) => (
                      <div key={contributor.id} className="flex items-center justify-between p-3 border border-white/10 bg-white/5">
                        <div className="flex items-center space-x-4">
                          <span className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${
                            contributor.rank === 1 ? 'text-white bg-white/20' :
                            contributor.rank === 2 ? 'text-white/80 bg-white/10' :
                            contributor.rank === 3 ? 'text-white/60 bg-white/5' : 'text-white/40'
                          }`}>
                            #{contributor.rank}
                          </span>
                          <span className="text-lg">{contributor.avatar}</span>
                          <div>
                            <div className="text-white font-bold">{contributor.username}</div>
                            <div className="text-white/60 text-sm">
                              {contributor.contributions} contributions • Joined {contributor.joinedDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{contributor.xpEarned.toLocaleString()} XP</div>
                          <div className="text-white/60 text-sm">
                            Last active: {contributor.lastActivity.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Panel */}
              <div className="space-y-6">
                <div className="black-glass p-4 white-glow">
                  <h3 className="text-white font-bold mb-4 subtle-glow">COMPETITION STATS</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">TOTAL PROJECTS:</span>
                      <span className="text-white">{opensourceProjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">ACTIVE PROJECTS:</span>
                      <span className="text-green-400">{opensourceProjects.filter(p => p.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">TOTAL CONTRIBUTORS:</span>
                      <span className="text-white">{opensourceProjects.reduce((sum, p) => sum + p.participants, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">TOTAL CONTRIBUTIONS:</span>
                      <span className="text-white">{opensourceProjects.reduce((sum, p) => sum + p.currentContributions, 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="black-glass p-4 white-glow">
                  <h3 className="text-white font-bold mb-4 subtle-glow">YOUR RANK</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">#42</div>
                    <div className="text-white/60 text-sm mb-4">OUT OF 1,247 CONTRIBUTORS</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">YOUR XP:</span>
                        <span className="text-white text-sm">3,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">CONTRIBUTIONS:</span>
                        <span className="text-white text-sm">23</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white subtle-glow mb-2">MY CONTRIBUTIONS</h2>
              <p className="text-white/60">TRACK YOUR PROGRESS ACROSS ALL PROJECTS</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="black-glass p-6 white-glow">
                  <h3 className="text-white font-bold mb-4 subtle-glow">RECENT ACTIVITY</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'commit', project: 'NEURAL_UI.FRAMEWORK', message: 'Added responsive button component', time: '2 hours ago', xp: 150 },
                      { type: 'pr', project: 'AI_CODE_ASSISTANT.BOT', message: 'Implemented code analysis pipeline', time: '1 day ago', xp: 300 },
                      { type: 'review', project: 'NEURAL_UI.FRAMEWORK', message: 'Reviewed accessibility improvements', time: '2 days ago', xp: 100 },
                      { type: 'commit', project: 'QUANTUM_ALGORITHMS.LIB', message: 'Fixed quantum gate implementation', time: '3 days ago', xp: 200 }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border border-white/10 bg-white/5">
                        <div className="text-green-400">
                          {activity.type === 'commit' && <GitCommit className="w-4 h-4" />}
                          {activity.type === 'pr' && <GitPullRequest className="w-4 h-4" />}
                          {activity.type === 'review' && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm">{activity.project}</div>
                          <div className="text-white/80 text-sm">{activity.message}</div>
                          <div className="text-white/60 text-xs">{activity.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-sm">+{activity.xp} XP</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="black-glass p-4 white-glow">
                  <h3 className="text-white font-bold mb-4 subtle-glow">YOUR STATS</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">TOTAL XP:</span>
                      <span className="text-white font-bold">3,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">CONTRIBUTIONS:</span>
                      <span className="text-white">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">PROJECTS:</span>
                      <span className="text-white">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">RANK:</span>
                      <span className="text-white">#42</span>
                    </div>
                  </div>
                </div>

                <div className="black-glass p-4 white-glow">
                  <h3 className="text-white font-bold mb-4 subtle-glow">ACHIEVEMENTS</h3>
                  <div className="space-y-2">
                    {[
                      { title: 'FIRST CONTRIBUTION', description: 'Made your first commit', earned: true },
                      { title: 'CODE REVIEWER', description: 'Reviewed 10 pull requests', earned: true },
                      { title: 'TEAM PLAYER', description: 'Collaborated on 3 projects', earned: true },
                      { title: 'MASTER CONTRIBUTOR', description: 'Earned 5000+ XP', earned: false }
                    ].map((achievement, index) => (
                      <div key={index} className={`flex items-center space-x-2 p-2 border ${
                        achievement.earned ? 'border-green-400/30 bg-green-400/10' : 'border-white/10 bg-white/5'
                      }`}>
                        <Award className={`w-4 h-4 ${achievement.earned ? 'text-green-400' : 'text-white/40'}`} />
                        <div>
                          <div className={`text-sm font-bold ${achievement.earned ? 'text-white' : 'text-white/60'}`}>
                            {achievement.title}
                          </div>
                          <div className="text-xs text-white/60">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.9)' }}>
          <div className="black-glass max-w-2xl w-full white-glow-strong overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Background Image */}
            <div 
              className="absolute inset-0 card-image"
              style={{
                backgroundImage: `url(${selectedProject.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/80" />
            
            <div className="relative z-10">
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm subtle-glow">PROJECT_DETAILS.<span className="text-green-400">EXE</span></span>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="text-white/80 hover:text-white text-lg"
                  >
                    [<span className="text-green-400">X</span>]
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-white font-bold text-xl mb-2 subtle-glow">{selectedProject.title}</h3>
                <p className="text-green-400 text-sm mb-4">{selectedProject.theme}</p>
                <p className="text-white/80 mb-6">{selectedProject.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-white font-bold mb-3">REQUIREMENTS:</h4>
                  <ul className="space-y-2">
                    {selectedProject.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Target className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-white/60 text-sm mb-1">DEADLINE:</div>
                    <div className="text-white">{selectedProject.deadline.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-sm mb-1">XP REWARD:</div>
                    <div className="text-white font-bold">{selectedProject.xpReward.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    className="flex-1 black-glass border border-green-400/30 text-green-400 font-bold py-2 px-4 hover:bg-green-400/10 transition-all subtle-glow"
                    onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>[<span className="text-green-400">VIEW</span>_ON_GITHUB]</span>
                    </div>
                  </button>
                  <button 
                    className="flex-1 black-glass border border-white/20 text-white font-bold py-2 px-4 hover:white-glow transition-all"
                  >
                    [<span className="text-green-400">JOIN</span>_PROJECT]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpensourceCompetitions;