import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Terminal, 
  Eye, 
  Code2, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowLeft,
  Zap,
  Target
} from 'lucide-react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  difficulty: 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER';
  xpReward?: number;
}

interface CodingIDEProps {
  pathId: string;
  pathTitle: string;
  onBack: () => void;
  onChallengeComplete?: (xpEarned: number, totalChallenges: number, completedChallenges: number, topic?: string, completedQuestions?: number) => void;
}

const sampleChallenges: Record<string, Challenge[]> = {
  javascript: [
    {
      id: 'js-1',
      title: 'HELLO_WORLD.JS',
      description: 'PRINT "HELLO, WORLD!" TO THE CONSOLE',
      instructions: [
        'WRITE CODE TO PRINT "Hello, World!"',
        'RUN THE CODE TO SEE THE OUTPUT',
      ],
      starterCode: '// Print Hello, World!\nconsole.log("Hello, World!");',
      expectedOutput: 'Hello, World!',
      hints: [
        'USE console.log()',
        'STRINGS ARE WRAPPED IN QUOTES',
      ],
      difficulty: 'NOVICE',
    },
  ],
  java: [
    {
      id: 'java-1',
      title: 'HELLO_WORLD.JAVA',
      description: 'PRINT "HELLO, WORLD!" IN JAVA',
      instructions: [
        'WRITE CODE TO PRINT "Hello, World!"',
        'RUN THE CODE TO SEE THE OUTPUT',
      ],
      starterCode: 'public class Main {\n    public static void main(String[] args) {\n        // Print Hello, World!\n        System.out.println("Hello, World!");\n    }\n}',
      expectedOutput: 'Hello, World!\n',
      hints: [
        'USE System.out.println()',
        'JAVA CODE RUNS IN THE MAIN METHOD',
      ],
      difficulty: 'NOVICE',
    },
  ],
  cpp: [
    {
      id: 'cpp-1',
      title: 'HELLO_WORLD.CPP',
      description: 'PRINT "HELLO, WORLD!" IN C++',
      instructions: [
        'WRITE CODE TO PRINT "Hello, World!"',
        'RUN THE CODE TO SEE THE OUTPUT',
      ],
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Print Hello, World!\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
      expectedOutput: 'Hello, World!\n',
      hints: [
        'USE cout << ... << endl;',
        'INCLUDE <iostream> AND USE std;',
      ],
      difficulty: 'NOVICE',
    },
  ],
  c: [
    {
      id: 'c-1',
      title: 'HELLO_WORLD.C',
      description: 'PRINT "HELLO, WORLD!" IN C',
      instructions: [
        'WRITE CODE TO PRINT "Hello, World!"',
        'RUN THE CODE TO SEE THE OUTPUT',
      ],
      starterCode: '#include <stdio.h>\n\nint main() {\n    // Print Hello, World!\n    printf("Hello, World!\\n");\n    return 0;\n}',
      expectedOutput: 'Hello, World!\n',
      hints: [
        'USE printf()',
        'INCLUDE <stdio.h>',
      ],
      difficulty: 'NOVICE',
    },
  ],
  react: [
    {
      id: 'react-1',
      title: 'COMPONENT_CREATION.JSX',
      description: 'BUILD YOUR FIRST REACT COMPONENT',
      instructions: [
        'CREATE A FUNCTIONAL COMPONENT NAMED "WelcomeMessage"',
        'RETURN A DIV WITH "Welcome to React!" TEXT',
        'RENDER THE COMPONENT IN THE APP',
      ],
      starterCode: 'import React from \'react\';\n\n// NEURAL ACADEMY - REACT PATHWAY\n// CHALLENGE: COMPONENT CREATION\n\n// YOUR CODE HERE\n\nfunction App() {\n  return (\n    <div>\n      {/* RENDER YOUR COMPONENT HERE */}\n    </div>\n  );\n}\n\nexport default App;',
      expectedOutput: 'Welcome to React!',
      hints: [
        'FUNCTIONAL COMPONENTS ARE JUST FUNCTIONS THAT RETURN JSX',
        'JSX LOOKS LIKE HTML BUT IS JAVASCRIPT',
        'COMPONENTS MUST START WITH CAPITAL LETTERS',
      ],
      difficulty: 'APPRENTICE',
    },
  ],
  python: [
    {
      id: 'python-1',
      title: 'HELLO_WORLD.PY',
      description: 'PRINT "HELLO, WORLD!" IN PYTHON',
      instructions: [
        'WRITE CODE TO PRINT "Hello, World!"',
        'RUN THE CODE TO SEE THE OUTPUT',
      ],
      starterCode: 'print("Hello, World!")',
      expectedOutput: 'Hello, World!\n',
      hints: [
        'print()',
      ],
      difficulty: 'NOVICE',
    },
    {
      id: 'python-2',
      title: 'SUM_TWO_NUMBERS.PY',
      description: 'WRITE A PROGRAM TO SUM TWO NUMBERS',
      instructions: [
        'READ TWO INTEGERS FROM INPUT',
        'PRINT THEIR SUM',
      ],
      starterCode: 'a = int(input())\nb = int(input())\n# Print the sum',
      expectedOutput: '',
      hints: [
        'input()',
      ],
      difficulty: 'NOVICE',
    },
    {
      id: 'python-3',
      title: 'LIST_COMPREHENSION.PY',
      description: 'CREATE A LIST OF SQUARES FROM 1 TO N',
      instructions: [
        'READ AN INTEGER N',
        'PRINT A LIST OF SQUARES FROM 1 TO N',
      ],
      starterCode: 'n = int(input())\n# Print squares from 1 to n',
      expectedOutput: '',
      hints: [
        'list comprehension',
      ],
      difficulty: 'APPRENTICE',
    },
    {
      id: 'python-4',
      title: 'FACTORIAL.PY',
      description: 'CALCULATE THE FACTORIAL OF A NUMBER',
      instructions: [
        'READ AN INTEGER N',
        'PRINT THE FACTORIAL OF N',
      ],
      starterCode: 'n = int(input())\n# Print factorial of n',
      expectedOutput: '',
      hints: [
        'recursion',
      ],
      difficulty: 'EXPERT',
    },
  ],
};

// Add languageId mapping for Judge0
const judge0LanguageIds: Record<string, number> = {
  javascript: 63, // JavaScript (Node.js)
  java: 62,
  cpp: 54,
  c: 50,
  react: 63, // fallback to JS for React
  python: 71, // Python 3
};

const allowedDiffs = ['NOVICE', 'APPRENTICE', 'EXPERT', 'MASTER'] as const;
type DiffType = typeof allowedDiffs[number];
function toDiffType(val: string): 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER' {
  const upper = val.toUpperCase();
  if (upper === 'NOVICE' || upper === 'APPRENTICE' || upper === 'EXPERT' || upper === 'MASTER') {
    return upper as 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER';
  }
  return 'NOVICE';
}

const CodingIDE: React.FC<CodingIDEProps> = ({ pathId, pathTitle, onBack, onChallengeComplete }) => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [terminalHistory, setTerminalHistory] = useState<Array<{type: 'system' | 'success' | 'error' | 'hint' | 'output' | 'input', message: string}>>([]);
  const [showHints, setShowHints] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [hasRunCode, setHasRunCode] = useState(false);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [globalXP, setGlobalXP] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const helloWorldChallenge = {
    id: 'python-hello-world',
    title: 'HELLO_WORLD.PY',
    description: 'PRINT "HELLO, WORLD!" IN PYTHON',
    instructions: [
      'WRITE CODE TO PRINT "Hello, World!"',
      'RUN THE CODE TO SEE THE OUTPUT',
    ],
    starterCode: 'print("Hello, World!")',
    expectedOutput: 'Hello, World!\n',
    hints: [
      'USE print()',
      'PYTHON USES INDENTATION',
    ],
    difficulty: 'NOVICE' as 'NOVICE',
  };

  useEffect(() => {
    if (pathId === 'python') {
      setChallenges([helloWorldChallenge]);
      setCurrentChallenge(0);
    } else {
      setChallenges(sampleChallenges[pathId] || []);
      setCurrentChallenge(0);
    }
    // eslint-disable-next-line
  }, [pathId]);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    setHasRunCode(false);
    if (challenge) {
      // Only prefill code if challenge.starterCode exists, otherwise leave empty
      setCode(challenge.starterCode || '');
      setTerminalHistory([
        { type: 'system', message: `INITIALIZING ${challenge.title || challenge.description || ''}...` },
        { type: 'system', message: `DIFFICULTY: ${challenge.difficulty || ''}` },
        { type: 'system', message: challenge.description || '' },
        { type: 'system', message: 'INSTRUCTIONS LOADED. BEGIN WHEN READY.' }
      ]);
      setChallengeStatus('pending');
    }
  }, [challenge]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    if (challengeStatus === 'success' && challenge && !completedChallengeIds.includes(challenge.id)) {
      const xpEarned = challenge.xpReward || 100;
      const newCompleted = [...completedChallengeIds, challenge.id];
      setCompletedChallengeIds(newCompleted);
      if (onChallengeComplete) {
        // Pass topic and completedQuestions as undefined for now (since not tracked per challenge)
        onChallengeComplete(xpEarned, challenges.length, newCompleted.length, undefined, undefined);
      }
    }
    // eslint-disable-next-line
  }, [challengeStatus]);

  useEffect(() => {
    if (challenges.length > 0 && completedChallengeIds.length === challenges.length) {
      setAllCompleted(true);
    } else {
      setAllCompleted(false);
    }
    // Sum XP for all completed challenges
    const xp = challenges.reduce((acc, ch) => acc + (completedChallengeIds.includes(ch.id) ? (ch.xpReward || 100) : 0), 0);
    setGlobalXP(xp);
  }, [completedChallengeIds, challenges]);

  useEffect(() => {
    const saved = localStorage.getItem(`checkpoint_${pathId}`);
    if (saved) setCompletedChallengeIds(JSON.parse(saved));
  }, [pathId]);

  useEffect(() => {
    localStorage.setItem(`checkpoint_${pathId}`, JSON.stringify(completedChallengeIds));
  }, [completedChallengeIds, pathId]);

  const runCode = async () => {
    if (!challenge) return;
    if (pathId === 'react') {
      setTerminalHistory(prev => [
        ...prev,
        { type: 'system', message: 'LIVE PREVIEW UPDATED' },
      ]);
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
    setTerminalHistory(prev => [...prev, { type: 'system', message: 'EXECUTING CODE...' }]);
    try {
      const response = await fetch('http://localhost:5050/api/judge0/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: judge0LanguageIds[pathId] || 63,
          stdin: input,
        }),
      });
      const data = await response.json();
      console.log('Judge0 response:', data);
      let outputText = '';
      if (data.stdout) {
        outputText = atob(data.stdout);
      } else if (data.stderr) {
        outputText = atob(data.stderr);
      } else if (data.compile_output) {
        outputText = atob(data.compile_output);
      } else {
        outputText = 'No output.';
      }
      setOutput(outputText);
      setTerminalHistory(prev => [
        ...prev,
        { type: 'success', message: 'CODE EXECUTION COMPLETE' },
        { type: 'output', message: outputText },
      ]);
      setHasRunCode(true);
    } catch (error) {
      setOutput('Failed to execute code.');
      setTerminalHistory(prev => [...prev, { type: 'error', message: 'FAILED TO EXECUTE CODE.' }]);
    }
    setIsRunning(false);
  };

  const resetCode = () => {
    if (challenge) {
      setCode(challenge.starterCode);
      setOutput('');
      setChallengeStatus('pending');
      setTerminalHistory(prev => [
        ...prev,
        { type: 'system', message: 'CODE RESET TO INITIAL STATE' }
      ]);
    }
  };

  const requestHint = () => {
    if (challenge && challenge.hints.length > 0) {
      setShowHints(true);
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

  const handleNextChallenge = async () => {
    if (challenges.length === 1 && currentChallenge === 0) {
      setIsFetchingNext(true);
      try {
        const response = await fetch('http://localhost:8000/generate-challenges/?type=learning_pathway', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: pathId, difficulty: 'beginner', type: 'learning_pathway' })
        });
        const data = await response.json();
        let loadedChallenges: Challenge[] = [];
        if (data.challenges && Array.isArray(data.challenges) && data.challenges.length > 0) {
          loadedChallenges = data.challenges.map((ch: any, idx: number): Challenge => ({
            id: `backend-${idx}`,
            title: 'CHALLENGE',
            description: ch.question || '',
            instructions: Array.isArray(ch.instructions) ? ch.instructions : [],
            starterCode: '',
            expectedOutput: '',
            hints: ch.hint ? [ch.hint] : [],
            difficulty: (ch.difficulty && ["NOVICE", "APPRENTICE", "EXPERT", "MASTER"].includes(ch.difficulty.toUpperCase()))
              ? ch.difficulty.toUpperCase() as 'NOVICE' | 'APPRENTICE' | 'EXPERT' | 'MASTER'
              : 'NOVICE',
            xpReward: 100,
          }));
        }
        if (loadedChallenges.length === 0) {
          alert('No dynamic challenges were returned from the backend.');
          setIsFetchingNext(false);
          return;
        }
        setChallenges(loadedChallenges);
        setCurrentChallenge(0);
      } catch (err) {
        alert('Failed to fetch dynamic challenges. See console for details.');
        console.error('Failed to fetch challenges:', err);
      }
      setIsFetchingNext(false);
    } else {
      setCurrentChallenge((prev) => Math.min(challenges.length - 1, prev + 1));
    }
  };

  if (!challenge && !isFetchingNext) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <style>{`
        .terminal-cursor::after {
          content: '_';
          animation: blink 1s infinite;
          color: rgba(0, 255, 65, 0.5);
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .subtle-glow {
          text-shadow: 0 0 2px rgba(0, 255, 65, 0.3);
        }
        .black-glass {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .success-glow {
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }
        .error-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
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
                <Code2 className="w-5 h-5 text-white" />
                <span className="text-white subtle-glow font-bold">{pathTitle}</span>
                <ChevronRight className="w-4 h-4 text-white/40" />
                <span className="text-white/80 text-sm">{challenge.title}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-white/60" />
                <span className="text-white/60">CHALLENGE {currentChallenge + 1}/{challenges.length}</span>
              </div>
              <div className={`flex items-center space-x-2 ${
                challengeStatus === 'success' ? 'text-green-400' : 
                challengeStatus === 'error' ? 'text-white' : 'text-white/60'
              }`}>
                {challengeStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {challengeStatus === 'error' && <XCircle className="w-4 h-4" />}
                {challengeStatus === 'pending' && <Zap className="w-4 h-4" />}
                <span className="font-bold">{challengeStatus.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Panel - Code Editor & Preview */}
        <div className="flex-1 flex flex-col border-r border-white/10">
          {/* Code Editor Header */}
          <div className="border-b border-white/10 black-glass">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">CODE_EDITOR.JS</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={resetCode}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET</span>
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs font-bold transition-all ${
                    isRunning 
                      ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                      : 'bg-green-600/20 border border-green-400/30 text-green-400 hover:bg-green-600/30 success-glow'
                  }`}
                >
                  {isRunning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isRunning ? 'RUNNING...' : 'RUN'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-black/50">
            {pathId === 'react' ? (
              <div className="flex flex-col md:flex-row h-full">
                {/* Code Editor */}
                <div className="flex-1 min-w-0 border-r border-white/10 p-2">
                  <LiveProvider code={code} noInline>
                    <LiveEditor
                      onChange={setCode}
                      className="w-full h-full bg-black text-white font-mono text-sm p-4 resize-none outline-none border border-white/10 rounded"
                      style={{ background: 'black', color: 'white', fontFamily: 'monospace', minHeight: 300 }}
                    />
                  </LiveProvider>
                  <div className="text-xs text-white/50 mt-2">
                    <span className="font-bold">Hint:</span> For live preview, end your code with <code>render(&lt;App /&gt;)</code> or <code>render(&lt;YourComponent /&gt;)</code>.
                  </div>
                </div>
                {/* Live Preview & Error */}
                <div className="flex-1 min-w-0 p-2 flex flex-col">
                  <div className="text-white/60 text-xs mb-1">LIVE PREVIEW:</div>
                  <div className="bg-white text-black rounded p-4 flex-1 min-h-[120px]">
                    <LiveProvider code={code} noInline>
                      <LivePreview />
                    </LiveProvider>
                  </div>
                  <div className="text-red-400 text-xs mt-2 bg-black/80 p-2 rounded">
                    <LiveProvider code={code} noInline>
                      <LiveError />
                    </LiveProvider>
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-white font-mono text-sm p-4 resize-none outline-none"
                placeholder="// START CODING HERE..."
                spellCheck={false}
              />
            )}
          </div>

          {/* Preview/Console Tabs */}
          <div className="border-t border-white/10">
            <div className="flex border-b border-white/10 black-glass">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                  activeTab === 'preview' 
                    ? 'text-white border-b-2 border-green-400' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>PREVIEW</span>
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                  activeTab === 'console' 
                    ? 'text-white border-b-2 border-green-400' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>CONSOLE</span>
              </button>
            </div>
            
            <div className="h-32 bg-black/30 p-4">
              {activeTab === 'preview' && (
                <div className="h-full">
                  <div className="text-white/60 text-xs mb-2">OUTPUT:</div>
                  <div className="text-white font-mono text-sm">
                    {output || 'NO OUTPUT YET'}
                  </div>
                </div>
              )}
              {activeTab === 'console' && (
                <div className="h-full flex flex-col">
                  <div className="text-white/60 text-xs mb-2">CONSOLE LOG:</div>
                  <div className="text-white/80 font-mono text-sm flex-1">
                    {output ? `> ${output}` : '> WAITING FOR EXECUTION...'}
                  </div>
                  <div className="mt-2 flex">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Enter all input for your code here, one per line, before running."
                      className="flex-1 px-2 py-1 text-xs bg-black border border-white/20 text-white rounded resize-y min-h-[32px] max-h-24"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Instructions & Terminal */}
        <div className="w-96 flex flex-col bg-black/30">
          {/* Instructions Header */}
          <div className="border-b border-white/10 black-glass">
            <div className="px-4 py-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-white subtle-glow font-bold">NEURAL_TERMINAL</span>
              </div>
            </div>
          </div>

          {/* Challenge Instructions */}
          <div className="border-b border-white/10 p-4 bg-black/20 min-h-[200px] flex flex-col justify-center items-center">
            {allCompleted ? (
              <div className="text-green-400 font-bold text-lg mb-2">All challenges completed!</div>
            ) : isFetchingNext ? (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <svg className="animate-spin h-6 w-6 text-green-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                <span className="text-white/80 text-sm">Loading challenges...</span>
              </div>
            ) : (
              <>
                <p className="text-white mb-2 subtle-glow text-lg text-center">{challenge.description}</p>
                {/* Instructions Button and Modal */}
                <button
                  className="mb-2 px-2 py-1 text-xs bg-white/10 border border-green-400/30 text-green-400 rounded hover:bg-white/20 transition-all"
                  onClick={() => setShowInstructions(true)}
                  disabled={allCompleted}
                >
                  SHOW INSTRUCTIONS
                </button>
                {showInstructions && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-black rounded-lg p-6 max-w-lg w-full border border-white/20">
                      <h4 className="text-white font-bold mb-2">Instructions</h4>
                      <div className="space-y-2 mb-4">
                        {challenge.instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start space-x-2 text-xs">
                            <span className="text-green-400 mt-0.5">{index + 1}.</span>
                            <span className="text-white/80">{instruction}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        className="mt-2 px-3 py-1 text-xs bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                        onClick={() => setShowInstructions(false)}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex space-x-2">
                  <button
                    className="px-2 py-1 text-xs bg-black/40 border border-green-400/30 text-green-400 rounded hover:bg-white/20 transition-all"
                    onClick={() => setShowHints(true)}
                  >
                    HINT
                  </button>
                  <button
                    onClick={() => setCurrentChallenge((prev) => Math.max(0, prev - 1))}
                    disabled={currentChallenge === 0}
                    className={`flex items-center space-x-1 px-2 py-1 text-xs border border-white/30 transition-all ${currentChallenge === 0 ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNextChallenge}
                    disabled={isFetchingNext || (pathId !== 'python' && !hasRunCode)}
                    className={`flex items-center space-x-1 px-2 py-1 text-xs border border-white/30 transition-all ${(isFetchingNext || (pathId !== 'python' && !hasRunCode)) ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isFetchingNext ? (
                      <svg className="animate-spin h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    ) : <span>Next</span>}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {showHints && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-black rounded-lg p-6 max-w-xs w-full border border-green-400/30">
                      <div className="mb-4 text-green-400 text-center text-sm">{challenge.hints && challenge.hints[0]}</div>
                      <button
                        className="mt-2 px-3 py-1 text-xs bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                        onClick={() => setShowHints(false)}
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Terminal Output */}
          <div className="flex-1 overflow-hidden">
            <div 
              ref={terminalRef}
              className="h-full overflow-y-auto p-4 space-y-2 text-xs"
            >
              {terminalHistory.map((entry, index) => (
                entry.type === 'output' ? (
                  <div key={index} className="text-white font-mono text-sm whitespace-pre-line">{entry.message}</div>
                ) : (
                  <div key={index} className={`${
                    entry.type === 'system' ? 'text-white/60' :
                    entry.type === 'success' ? 'text-green-400' :
                    entry.type === 'error' ? 'text-red-400' :
                    entry.type === 'input' ? 'text-white' :
                    entry.type === 'hint' ? 'text-white/80' :
                    'text-white'
                  }`}>
                    <span className="text-green-400">neural@academy:~$</span> {entry.message}
                  </div>
                )
              ))}
              <div className="text-green-400 terminal-cursor">neural@academy:~$</div>
            </div>
          </div>
        </div>
      </div>

      {/* Show Complete button/message when all challenges are done */}
      {allCompleted && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/90 border border-green-400/40 rounded-xl p-8 flex flex-col items-center shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-green-400 mb-4 success-glow" />
            <h2 className="text-2xl font-bold text-green-400 mb-2">Congratulations!</h2>
            <p className="text-white/80 mb-6">You have completed all challenges for this language.</p>
            <button
              className="px-6 py-3 bg-green-600/80 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg"
              onClick={() => window.location.reload()} // or trigger a callback/onBack
            >
              Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingIDE;