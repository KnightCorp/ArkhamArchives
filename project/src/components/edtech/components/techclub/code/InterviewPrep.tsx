import React, { useState } from "react";
import { 
  Medal, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  Users,
  Award,
  Calendar,
  BarChart3,
  Lightbulb,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import PracticeSession from "./PracticeSession";
import StatsPanel from "./StatsPanel";
import vastData from "./vastData.json";
import MockInterviewSession from "./MockInterviewSession";

const TABS = [
  { key: 'practice', label: 'Practice', icon: BookOpen },
  { key: 'mock', label: 'Mock Interviews', icon: Users },
  { key: 'tips', label: 'Tips & Strategies', icon: Lightbulb },
  { key: 'resources', label: 'Resources', icon: ExternalLink },
  { key: 'progress', label: 'Progress', icon: TrendingUp },
];

const TabHeader = ({ selected, onSelect }: { selected: string, onSelect: (key: string) => void }) => (
  <>
    <div className="flex justify-center gap-4 mb-6 w-full flex-wrap">
      {TABS.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            className={`relative px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center gap-2
              ${selected === tab.key 
                ? 'border-2 border-[#C0C0C0] text-[#C0C0C0] bg-black/80 scale-105 shadow-lg' 
                : 'border border-transparent text-white/60 bg-black/40 hover:border-[#C0C0C0] hover:scale-105 hover:text-white'
              } group`}
            style={{ outline: 'none' }}
            onMouseEnter={e => e.currentTarget.classList.add('z-10')}
            onMouseLeave={e => e.currentTarget.classList.remove('z-10')}
            onClick={() => onSelect(tab.key)}
          >
            <Icon className="w-5 h-5" />
            <span className="transition-all duration-200">{tab.label}</span>
          </button>
        );
      })}
    </div>
    <div className="border-b border-[#C0C0C0] w-full mb-8" />
  </>
);

const ProgressCard = ({ title, value, total, icon: Icon, color = "text-green-400" }: any) => (
  <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#C0C0C0]" />
        <span className="text-white/80 text-sm font-medium">{title}</span>
      </div>
      <span className={`text-lg font-bold ${color}`}>{value}/{total}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
        style={{ width: `${(value / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

const TopicCard = ({ topic }: any) => (
  <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4 hover:bg-black/80 transition-all">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-white font-bold">{topic.name}</h3>
      <span className={`px-2 py-1 text-xs rounded ${
        topic.difficulty === 'easy' ? 'bg-green-600/20 text-green-400' :
        topic.difficulty === 'medium' ? 'bg-gray-600/20 text-gray-300' :
        'bg-white/20 text-white'
      }`}>
        {topic.difficulty}
      </span>
    </div>
    <p className="text-white/60 text-sm mb-2">{topic.description}</p>
    <div className="flex items-center gap-2 text-white/80 text-sm">
      <BookOpen className="w-4 h-4" />
      <span>{topic.questionCount} questions</span>
    </div>
  </div>
);

const ResourceCard = ({ resource }: any) => (
  <a 
    href={resource.url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="block bg-black/60 border border-[#C0C0C0] rounded-lg p-4 hover:bg-black/80 transition-all group"
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-[#C0C0C0] font-bold group-hover:text-white transition-colors">{resource.title}</h3>
      <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
    </div>
    <p className="text-white/80 text-sm mb-2">{resource.description}</p>
    <span className="inline-block px-2 py-1 bg-[#C0C0C0]/20 text-[#C0C0C0] text-xs rounded">
      {resource.category}
    </span>
  </a>
);

const TipCard = ({ tip, index }: any) => (
  <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4 hover:bg-black/80 transition-all">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-[#C0C0C0]/20 rounded-full flex items-center justify-center">
        <span className="text-[#C0C0C0] font-bold text-sm">{index + 1}</span>
      </div>
      <p className="text-white/90 text-base leading-relaxed">{tip}</p>
    </div>
  </div>
);

const StudyPlanCard = ({ plan, onStart }: any) => (
  <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4 hover:bg-black/80 transition-all">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white font-bold text-lg">{plan.title}</h3>
      <span className="text-[#C0C0C0] text-sm">{plan.duration}</span>
    </div>
    <p className="text-white/70 text-sm mb-3">{plan.description}</p>
    <div className="flex flex-wrap gap-1 mb-3">
      {plan.topics.map((topic: string, idx: number) => (
        <span key={idx} className="px-2 py-1 bg-[#C0C0C0]/20 text-[#C0C0C0] text-xs rounded">
          {topic}
        </span>
      ))}
    </div>
    <button className="w-full px-4 py-2 bg-[#C0C0C0]/20 text-[#C0C0C0] rounded hover:bg-[#C0C0C0]/30 transition-all text-sm font-medium" onClick={onStart}>
      Start Plan
    </button>
  </div>
);

const InterviewPrep = () => {
  const [tab, setTab] = useState('practice');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [planQuestionIdx, setPlanQuestionIdx] = useState<number>(0);

  const categories = [
    { key: 'all', label: 'All Resources' },
    { key: 'Practice Platform', label: 'Practice Platforms' },
    { key: 'Learning Resource', label: 'Learning Resources' },
    { key: 'Book', label: 'Books' },
    { key: 'Course', label: 'Courses' },
    { key: 'Video Content', label: 'Video Content' },
    { key: 'System Design', label: 'System Design' },
    { key: 'Competitive Programming', label: 'Competitive Programming' },
    { key: 'Community', label: 'Community' }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? vastData.resources 
    : vastData.resources.filter((r: any) => r.category === selectedCategory);

  return (
    <div className="min-h-[80vh] flex flex-col items-center bg-gradient-to-br from-black via-zinc-900 to-black mt-12">
      <div className="w-full max-w-6xl mx-auto p-6 rounded-xl border border-[#C0C0C0] bg-black/80 backdrop-blur-md shadow-xl flex flex-col items-center glassmorphism">
        <TabHeader selected={tab} onSelect={setTab} />
        
        <div className="w-full mt-8">
          {tab === 'practice' && <PracticeSession />}
          
          {tab === 'mock' && <MockInterviewSession />}
          
          {tab === 'tips' && (
            <div className="text-white py-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#C0C0C0] mb-4">Interview Tips & Strategies</h2>
                <p className="text-white/70 mb-6">Master the art of technical interviews with these proven strategies and tips.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vastData.tips && vastData.tips.length > 0 ? (
                  vastData.tips.map((tip: string, idx: number) => (
                    <TipCard key={idx} tip={tip} index={idx} />
                  ))
                ) : (
                  <div className="text-white/60 text-center">No tips available.</div>
                )}
              </div>
            </div>
          )}
          
          {tab === 'resources' && (
            <div className="text-white py-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#C0C0C0] mb-4">Learning Resources</h2>
                <p className="text-white/70 mb-6">Curated resources to help you excel in technical interviews.</p>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(category => (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category.key
                          ? 'bg-[#C0C0C0] text-black'
                          : 'bg-black/40 text-white/60 hover:bg-black/60 hover:text-white'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources && filteredResources.length > 0 ? (
                  filteredResources.map((resource: any, idx: number) => (
                    <ResourceCard key={idx} resource={resource} />
                  ))
                ) : (
                  <div className="text-white/60 text-center col-span-full">No resources available for this category.</div>
                )}
              </div>
            </div>
          )}
          
          {tab === 'progress' && (
            <div className="text-white py-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#C0C0C0] mb-4">Your Progress</h2>
                <p className="text-white/70 mb-6">Track your interview preparation journey.</p>
              </div>
              
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <ProgressCard 
                  title="Questions Solved" 
                  value={vastData.progress.questionsCorrect} 
                  total={vastData.progress.totalQuestions}
                  icon={CheckCircle}
                  color="text-green-400"
                />
                <ProgressCard 
                  title="Mock Interviews" 
                  value={vastData.progress.mockInterviewsCompleted} 
                  total={vastData.progress.totalMockInterviews}
                  icon={Users}
                  color="text-gray-300"
                />
                <ProgressCard 
                  title="Streak Days" 
                  value={vastData.progress.streakDays} 
                  total={30}
                  icon={TrendingUp}
                  color="text-gray-300"
                />
                <ProgressCard 
                  title="Accuracy" 
                  value={vastData.progress.accuracy} 
                  total={100}
                  icon={Target}
                  color="text-white"
                />
              </div>
              
              {/* Study Plans */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#C0C0C0] mb-4">Recommended Study Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vastData.studyPlans.map((plan: any, idx: number) => (
                    <StudyPlanCard key={idx} plan={plan} onStart={() => { setActivePlan(plan); setPlanQuestionIdx(0); }} />
                  ))}
                </div>
              </div>
              
              {/* Weakest/Strongest Topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4">
                  <h4 className="text-[#C0C0C0] font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Areas to Improve
                  </h4>
                  <div className="space-y-2">
                    {vastData.progress.weakestTopics.map((topic: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-white/80">
                        <ChevronRight className="w-4 h-4" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4">
                  <h4 className="text-[#C0C0C0] font-bold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Strong Areas
                  </h4>
                  <div className="space-y-2">
                    {vastData.progress.strongestTopics.map((topic: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-white/80">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {activePlan && typeof activePlan === 'object' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
          <div className="bg-zinc-900 border border-[#C0C0C0] rounded-xl shadow-xl p-8 max-w-xl w-full relative">
            <button className="absolute top-4 right-4 text-white hover:text-[#C0C0C0] text-2xl" onClick={() => setActivePlan(null)}>&times;</button>
            <h2 className="text-2xl font-bold text-[#C0C0C0] mb-2">{activePlan.title}</h2>
            <p className="text-white/70 mb-4">{activePlan.description}</p>
            <div className="mb-4">
              <span className="text-[#C0C0C0] font-medium">Duration:</span> {activePlan.duration}
            </div>
            <div className="mb-4">
              <span className="text-[#C0C0C0] font-medium">Topics:</span> {Array.isArray(activePlan.topics) ? activePlan.topics.join(', ') : ''}
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#C0C0C0] mb-2">Question {planQuestionIdx + 1} of {Array.isArray(activePlan.questions) ? activePlan.questions.length : 0}</h3>
              <div className="bg-black/60 border border-[#C0C0C0] rounded-lg p-4">
                {/* Show the question from vastData.practiceQuestions */}
                {vastData.practiceQuestions && Array.isArray(activePlan.questions) && vastData.practiceQuestions.length > 0 && (
                  <>
                    <div className="mb-2 text-white font-bold">{vastData.practiceQuestions.find(q => q.id === activePlan.questions[planQuestionIdx])?.title || 'Question not found'}</div>
                    <div className="mb-2 text-white/80">{vastData.practiceQuestions.find(q => q.id === activePlan.questions[planQuestionIdx])?.description || ''}</div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 rounded bg-zinc-700 text-white font-bold disabled:opacity-50 transition-all border border-zinc-500/30 hover:bg-zinc-800"
                onClick={() => setPlanQuestionIdx(idx => Math.max(idx - 1, 0))}
                disabled={planQuestionIdx === 0}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 rounded bg-emerald-600 text-white font-bold disabled:opacity-50 transition-all border border-emerald-400/30 hover:bg-emerald-700"
                onClick={() => setPlanQuestionIdx(idx => Math.min(idx + 1, Array.isArray(activePlan.questions) ? activePlan.questions.length - 1 : 0))}
                disabled={!Array.isArray(activePlan.questions) || planQuestionIdx === activePlan.questions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep; 