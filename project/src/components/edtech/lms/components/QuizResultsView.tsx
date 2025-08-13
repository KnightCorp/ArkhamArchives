import React, { useState, useEffect } from 'react';
import { Users, Clock, TrendingUp, Award, Calendar, RefreshCw } from 'lucide-react';

interface QuizResult {
  id: string;
  quiz_id: string;
  student_id: string;
  student_name: string;
  class_id: string;
  answers: string[];
  score: number;
  time_taken: number;
  completed_at: string;
}

interface QuizResultsViewProps {
  quizId: string;
  classId: string; // Add classId prop
  onClose: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  quizId,
  classId,
  onClose
}) => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    fetchQuizResults();
    // Set up real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchQuizResults();
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [quizId, classId]);

  const fetchQuizResults = async () => {
    try {
      const response = await fetch(`http://localhost:8000/lms/quiz/results/${quizId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz results');
      }
      const data = await response.json();
      
      // Filter results by class
      const classResults = data.filter((result: QuizResult) => 
        result.class_id === classId
      );
      
      setResults(classResults);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchQuizResults();
    setLastUpdate(new Date());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-white';
    if (score >= 60) return 'text-gray-300';
    return 'text-gray-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🥇';
    if (score >= 60) return '🥈';
    return '🥉';
  };

  const calculateStats = () => {
    if (results.length === 0) return null;
    
    const scores = results.map(r => r.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const passRate = (scores.filter(s => s >= 60).length / scores.length) * 100;
    
    // Calculate rankings
    const sortedResults = [...results].sort((a, b) => b.score - a.score);
    const rankings = sortedResults.map((result, index) => ({
      ...result,
      rank: index + 1,
      isTop3: index < 3
    }));
    
    return {
      totalStudents: results.length,
      averageScore: Math.round(avgScore),
      highestScore: maxScore,
      lowestScore: minScore,
      passRate: Math.round(passRate),
      rankings,
      top3Students: rankings.slice(0, 3),
      medianScore: Math.round(scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)])
    };
  };

  const stats = calculateStats();

  if (loading && results.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-black border border-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading quiz results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-black border border-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-white mb-4">{error}</p>
            <button
              onClick={onClose}
              className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-black border border-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black border-b border-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">Class Results</h2>
              <div className="text-sm text-gray-300">
                Class: {classId}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-black border-b border-white p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalStudents}</div>
                <div className="text-sm text-gray-300">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.averageScore}%</div>
                <div className="text-sm text-gray-300">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.highestScore}%</div>
                <div className="text-sm text-gray-300">Highest Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.medianScore}%</div>
                <div className="text-sm text-gray-300">Median Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.passRate}%</div>
                <div className="text-sm text-gray-300">Pass Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Results Yet</h3>
              <p className="text-gray-400">Students in this class haven't completed this quiz yet.</p>
              <p className="text-gray-500 text-sm mt-2">Results are filtered for Class: {classId}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              {stats && stats.top3Students.length > 0 && (
                <div className="bg-black border border-white rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center">🏆 Top Performers</h3>
                  <div className="flex justify-center items-end gap-4">
                    {stats.top3Students.map((student, index) => (
                      <div key={student.id} className="text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2 border-2 ${
                          index === 0 ? 'bg-white text-black border-white' :
                          index === 1 ? 'bg-gray-300 text-black border-gray-300' :
                          'bg-gray-600 text-white border-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="text-white font-semibold">{student.student_name}</div>
                        <div className={`text-lg font-bold ${
                          index === 0 ? 'text-white' :
                          index === 1 ? 'text-gray-300' :
                          'text-gray-400'
                        }`}>
                          {student.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Results */}
              <div className="space-y-3">
                {stats?.rankings.map((result) => (
                  <div key={result.id} className="bg-black border border-white rounded-lg p-4 hover:bg-gray-900 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                            result.rank === 1 ? 'bg-white text-black border-white' :
                            result.rank === 2 ? 'bg-gray-300 text-black border-gray-300' :
                            result.rank === 3 ? 'bg-gray-600 text-white border-gray-600' :
                            'bg-gray-800 text-white border-gray-600'
                          }`}>
                            {result.rank}
                          </div>
                          <span className="text-lg font-semibold text-white">
                            {result.student_name}
                          </span>
                        </div>
                        {result.isTop3 && (
                          <span className="bg-white text-black px-2 py-1 rounded text-xs font-bold">
                            {result.rank === 1 ? '🥇 GOLD' : result.rank === 2 ? '🥈 SILVER' : '🥉 BRONZE'}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatTime(result.time_taken)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(result.completed_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Time: {formatTime(result.time_taken)}</span>
                      </div>
                    </div>

                    {/* Answer Summary */}
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-sm text-gray-400 mb-2">
                        Answered {result.answers.filter(a => a).length} out of {result.answers.length} questions
                      </div>
                      <div className="flex gap-1">
                        {result.answers.map((answer, idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 rounded-full border ${
                              answer ? 'bg-white border-white' : 'bg-gray-600 border-gray-600'
                            }`}
                            title={`Question ${idx + 1}: ${answer || 'Not answered'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black border-t border-white p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">
              {results.length} student{results.length !== 1 ? 's' : ''} completed
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 