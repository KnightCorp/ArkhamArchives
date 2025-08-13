import React, { useState, useEffect } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

const defaultStarterCode = `function HelloWorld() {
  return <div>Hello, React!</div>;
}

render(<HelloWorld />);`;

const reactSetupHint = `Install Node.js and npm (if not already installed).\nCreate a new React app using the command: npx create-react-app hello-world.\nNavigate to the project folder: cd hello-world.\nOpen the src/App.js file and replace its content with a simple Hello World component.\nRun the app using npm start and open it in your browser.`;

const ReactCodingIDE: React.FC = () => {
  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState(defaultStarterCode);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const fetchChallenge = () => {
    setIsLoading(true);
    fetch("http://localhost:8000/generate-learning-path/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "react" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.learning_path) && data.learning_path.length > 0) {
          setChallenge(data.learning_path[0]);
          setCode(data.learning_path[0].starterCode || defaultStarterCode);
        } else {
          setChallenge({
            title: "Your First React Component",
            hint: reactSetupHint,
            starterCode: defaultStarterCode,
          });
          setCode(defaultStarterCode);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchChallenge();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
      {/* Modal for Hint */}
      {showHint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 border border-yellow-400 rounded-lg p-8 max-w-2xl w-full shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-yellow-300 hover:text-yellow-100 text-xl font-bold"
              onClick={() => setShowHint(false)}
              aria-label="Close Hint"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-yellow-200">Hint</h3>
            <div className="text-yellow-100 text-base leading-relaxed whitespace-pre-line">
              {challenge?.hint || reactSetupHint}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row flex-1">
        {/* Left: Editor & Challenge */}
        <div className="flex-1 min-w-0 border-r border-white/10 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{challenge?.title}</h2>
            <button
              className="px-2 py-1 text-xs bg-blue-600/20 border border-blue-400/30 text-blue-400 hover:bg-blue-600/30 rounded"
              onClick={fetchChallenge}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Regenerate"}
            </button>
          </div>
          {/* Hint Button */}
          <button
            className="mb-2 px-2 py-1 text-xs bg-yellow-700/20 border border-yellow-400/30 text-yellow-300 hover:bg-yellow-700/30 rounded"
            onClick={() => setShowHint(true)}
          >
            Show Hint
          </button>
          <LiveProvider code={code} noInline>
            <LiveEditor
              onChange={setCode}
              className="w-full h-full bg-black text-white font-mono text-sm p-4 resize-none outline-none border border-white/10 rounded"
              style={{ minHeight: 200 }}
            />
          </LiveProvider>
        </div>
        {/* Right: Live Preview & Error */}
        <div className="flex-1 min-w-0 p-4 flex flex-col">
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
    </div>
  );
};

export default ReactCodingIDE; 