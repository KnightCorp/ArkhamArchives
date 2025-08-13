import React, { useState, useEffect, useRef } from 'react';
import { 
  Swords, 
  Clock, 
  Trophy, 
  Target, 
  Zap, 
  Users, 
  Crown,
  ArrowLeft,
  Play,
  Square,
  Eye,
  Terminal,
  CheckCircle2,
  XCircle,
  Medal,
  TrendingUp
} from 'lucide-react';

interface PVPMatch {
  id: string;
  title: string;
  description: string;
  problem: string;
  starterCode: string;
  expectedOutput: string;
  timeLimit: number;
  difficulty: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER';
  xpReward: number;
}

interface Player {
  id: string;
  username: string;
  level: number;
  xp: number;
  rank: number;
  avatar: string;
  status: 'waiting' | 'coding' | 'completed' | 'disconnected';
  progress: number;
}

interface PVPArenaProps {
  onBack: () => void;
}

const sampleMatches: PVPMatch[] = [
  {
    id: 'pvp-1',
    title: 'ARRAY_BATTLE.JS',
    description: 'FASTEST CODER WINS',
    problem: 'Write a function that finds the maximum number in an array',
    starterCode: 'function findMax(arr) {\n  // YOUR CODE HERE\n  \n}\n\n// Test: findMax([1, 5, 3, 9, 2]) should return 9',
    expectedOutput: '9',
    timeLimit: 300,
    difficulty: 'NOVICE',
    xpReward: 500
  },
  {
    id: 'pvp-2',
    title: 'STRING_DUEL.JS',
    description: 'REVERSE ENGINEERING CHALLENGE',
    problem: 'Create a function that reverses a string without using built-in reverse methods',
    starterCode: 'function reverseString(str) {\n  // YOUR CODE HERE\n  \n}\n\n// Test: reverseString("hello") should return "olleh"',
    expectedOutput: 'olleh',
    timeLimit: 240,
    difficulty: 'APPRENTICE',
    xpReward: 750
  }
];

const mockPlayers: Player[] = [
  { id: '1', username: 'NEURAL_HACKER', level: 15, xp: 12500, rank: 1, avatar: '🤖', status: 'coding', progress: 75 },
  { id: '2', username: 'CODE_NINJA', level: 12, xp: 9800, rank: 2, avatar: '🥷', status: 'coding', progress: 60 },
  { id: '3', username: 'BYTE_WARRIOR', level: 18, xp: 15200, rank: 3, avatar: '⚔️', status: 'completed', progress: 100 },
  { id: '4', username: 'CYBER_GHOST', level: 10, xp: 7500, rank: 4, avatar: '👻', status: 'coding', progress: 45 }
];

const globalRankings = [
  { rank: 1, username: 'QUANTUM_CODER', level: 25, xp: 28500, wins: 156, winRate: 89 },
  { rank: 2, username: 'MATRIX_MASTER', level: 23, xp: 25200, wins: 142, winRate: 85 },
  { rank: 3, username: 'NEURAL_HACKER', level: 15, xp: 12500, wins: 89, winRate: 78 },
  { rank: 4, username: 'CODE_NINJA', level: 12, xp: 9800, wins: 67, winRate: 72 },
  { rank: 5, username: 'BYTE_WARRIOR', level: 18, xp: 15200, wins: 98, winRate: 81 }
];

const PVPArena: React.FC<PVPArenaProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'lobby' | 'battle' | 'results'>('lobby');
  const [currentMatch, setCurrentMatch] = useState<PVPMatch | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [currentPlayer] = useState<Player>(mockPlayers[0]);
  const [matchResult, setMatchResult] = useState<{
    position: number;
    xpGained: number;
    timeUsed: number;
    accuracy: number;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'battle' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'battle') {
      endMatch();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, timeLeft]);

  const startMatch = (match: PVPMatch) => {
    setCurrentMatch(match);
    setCode(match.starterCode);
    setTimeLeft(match.timeLimit);
    setGameState('battle');
    setOutput('');
    setMatchResult(null);
  };

  const runCode = async () => {
    if (!currentMatch) return;

    setIsRunning(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple validation for demo
      const isCorrect = code.includes('Math.max') || code.includes('return') || code.includes('for');

      if (isCorrect) {
        setOutput(currentMatch.expectedOutput);
        endMatch(true);
      } else {
        setOutput('Incorrect output');
      }
    } catch (error) {
      setOutput('Runtime error');
    }

    setIsRunning(false);
  };

  const endMatch = (completed = false) => {
    if (!currentMatch) return;

    const timeUsed = currentMatch.timeLimit - timeLeft;
    const position = Math.floor(Math.random() * 4) + 1;
    const baseXP = currentMatch.xpReward;
    const positionMultiplier = position === 1 ? 1.5 : position === 2 ? 1.2 : position === 3 ? 1.0 : 0.8;
    const xpGained = Math.floor(baseXP * positionMultiplier);

    setMatchResult({
      position,
      xpGained,
      timeUsed,
      accuracy: completed ? 100 : Math.floor(Math.random() * 60) + 20
    });

    setGameState('results');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-white" />;
      case 2: return <Medal className="w-5 h-5 text-white/80" />;
      case 3: return <Medal className="w-5 h-5 text-white/60" />;
      default: return <Target className="w-5 h-5 text-white/60" />;
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

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <style jsx>{`
          .subtle-glow { text-shadow: 0 0 2px rgba(0, 255, 65, 0.3); }
          .black-glass { background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
          .battle-glow { box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
        `}</style>

        {/* Header */}
        <header className="border-b border-white/10 black-glass">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={onBack} className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">BACK</span>
                </button>
                <div className="flex items-center space-x-2">
                  <Swords className="w-6 h-6 text-white battle-glow" />
                  <span className="text-white subtle-glow font-bold">PVP_ARENA.EXE</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white/60">{players.length} ONLINE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-white/60" />
                  <span className="text-white/80">RANK #{currentPlayer.rank}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white subtle-glow mb-2">BATTLE ARENA</h1>
            <p className="text-white/60">COMPETE AGAINST OTHER CODERS IN REAL-TIME</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Matches */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white subtle-glow mb-4">ACTIVE BATTLES</h2>
              {sampleMatches.map((match) => (
                <div key={match.id} className="black-glass p-6 battle-glow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{match.title}</h3>
                    <span className={`px-2 py-1 text-xs font-bold border ${getDifficultyColor(match.difficulty)}`}>
                      {match.difficulty}
                    </span>
                  </div>

                  <p className="text-white/80 mb-4">{match.description}</p>
                  <p className="text-white/60 text-sm mb-4">{match.problem}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">{formatTime(match.timeLimit)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">{match.xpReward} XP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-white/60" />
                        <span className="text-white/80">{Math.floor(Math.random() * 8) + 2} players</span>
                      </div>
                    </div>

                    <button
                      onClick={() => startMatch(match)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all battle-glow"
                    >
                      <Swords className="w-4 h-4" />
                      <span>JOIN BATTLE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Rankings */}
            <div className="space-y-6">
              <div className="black-glass p-4">
                <h3 className="text-white font-bold mb-4 subtle-glow flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>GLOBAL RANKINGS</span>
                </h3>
                <div className="space-y-3">
                  {globalRankings.map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-2 border border-white/10 bg-white/5">
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                          player.rank === 1 ? 'text-white' :
                          player.rank === 2 ? 'text-white/80' :
                          player.rank === 3 ? 'text-white/60' : 'text-white/60'
                        }`}>
                          #{player.rank}
                        </span>
                        <div>
                          <div className="text-white text-sm font-bold">{player.username}</div>
                          <div className="text-white/60 text-xs">LVL {player.level} • {player.wins} wins</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/80 text-sm">{player.xp.toLocaleString()} XP</div>
                        <div className="text-green-400 text-xs">{player.winRate}% WR</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player Stats */}
              <div className="black-glass p-4">
                <h3 className="text-white font-bold mb-4 subtle-glow">YOUR STATS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">RANK:</span>
                    <span className="text-white">#{currentPlayer.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">LEVEL:</span>
                    <span className="text-white">{currentPlayer.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">XP:</span>
                    <span className="text-white">{currentPlayer.xp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">BATTLES WON:</span>
                    <span className="text-green-400">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">WIN RATE:</span>
                    <span className="text-green-400">76%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'battle' && currentMatch) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <style jsx>{`
          .subtle-glow { text-shadow: 0 0 2px rgba(0, 255, 65, 0.3); }
          .black-glass { background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
          .battle-glow { box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
        `}</style>

        {/* Battle Header */}
        <header className="border-b border-white/10 black-glass">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Swords className="w-6 h-6 text-white battle-glow" />
                <span className="text-white subtle-glow font-bold">{currentMatch.title}</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className={`font-mono font-bold ${timeLeft < 30 ? 'text-white' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white/60">{players.length} BATTLING</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-60px)]">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col border-r border-white/10">
            <div className="border-b border-white/10 black-glass p-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">{currentMatch.problem}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs font-bold transition-all ${
                      isRunning 
                        ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                        : 'bg-green-600/20 border border-green-400/30 text-green-400 hover:bg-green-600/30'
                    }`}
                  >
                    {isRunning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isRunning ? 'RUNNING...' : 'RUN'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-black/50">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
                spellCheck={false}
              />
            </div>

            {/* Preview/Console */}
            <div className="border-t border-white/10">
              <div className="flex border-b border-white/10 black-glass">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                    activeTab === 'preview' ? 'text-white border-b-2 border-green-400' : 'text-white/60'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>PREVIEW</span>
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                    activeTab === 'console' ? 'text-white border-b-2 border-green-400' : 'text-white/60'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>CONSOLE</span>
                </button>
              </div>
              
              <div className="h-32 bg-black/30 p-4">
                <div className="text-white font-mono text-sm">
                  {output || 'NO OUTPUT YET'}
                </div>
              </div>
            </div>
          </div>

          {/* Live Leaderboard */}
          <div className="w-80 bg-black/30 border-l border-white/10">
            <div className="border-b border-white/10 black-glass p-3">
              <h3 className="text-white font-bold subtle-glow">LIVE LEADERBOARD</h3>
            </div>
            
            <div className="p-4 space-y-3">
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-2 border border-white/10 bg-white/5">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{player.avatar}</span>
                    <div>
                      <div className="text-white text-sm font-bold">{player.username}</div>
                      <div className="text-white/60 text-xs">LVL {player.level}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      player.status === 'completed' ? 'text-green-400' :
                      player.status === 'coding' ? 'text-white' : 'text-white/60'
                    }`}>
                      {player.status === 'completed' ? 'DONE' : `${player.progress}%`}
                    </div>
                    <div className="w-16 bg-white/10 h-1 mt-1">
                      <div 
                        className={`h-1 transition-all ${
                          player.status === 'completed' ? 'bg-green-400' : 'bg-white'
                        }`}
                        style={{ width: `${player.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results' && matchResult) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center">
        <style jsx>{`
          .subtle-glow { text-shadow: 0 0 2px rgba(0, 255, 65, 0.3); }
          .black-glass { background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
          .victory-glow { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
        `}</style>

        <div className="black-glass p-8 max-w-md w-full mx-4 victory-glow">
          <div className="text-center">
            <div className="mb-6">
              {getPositionIcon(matchResult.position)}
              <h2 className="text-2xl font-bold text-white subtle-glow mt-2">
                {matchResult.position === 1 ? 'VICTORY!' : 
                 matchResult.position === 2 ? 'SECOND PLACE!' :
                 matchResult.position === 3 ? 'THIRD PLACE!' : 'BATTLE COMPLETE!'}
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white/60">POSITION:</span>
                <span className="text-white font-bold">#{matchResult.position}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">XP GAINED:</span>
                <span className="text-white font-bold">+{matchResult.xpGained}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">TIME USED:</span>
                <span className="text-white">{formatTime(matchResult.timeUsed)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">ACCURACY:</span>
                <span className="text-green-400">{matchResult.accuracy}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setGameState('lobby')}
                className="w-full bg-green-600/20 border border-green-400/30 text-green-400 py-2 px-4 hover:bg-green-600/30 transition-all"
              >
                RETURN TO ARENA
              </button>
              <button
                onClick={onBack}
                className="w-full bg-white/10 border border-white/20 text-white/80 py-2 px-4 hover:bg-white/20 transition-all"
              >
                EXIT TO PATHWAYS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PVPArena;