import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';

const initialCode = `// Riddle me this, detective...
function solveRiddle(input) {
  // Your solution here
  return '?';
}

console.log(solveRiddle('mystery'));`;

export const CodePlayground = () => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');

  const handleRunCode = () => {
    try {
      // Create a new function to run the code in a sandbox
      const runCode = new Function('console', `
        const log = [];
        const customConsole = {
          log: (...args) => log.push(args.join(' ')),
          error: (...args) => log.push('Error: ' + args.join(' ')),
          warn: (...args) => log.push('Warning: ' + args.join(' '))
        };
        with (customConsole) {
          ${code}
        }
        return log.join('\\n');
      `);

      const result = runCode(console);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <CodeEditor 
        value={code}
        onChange={setCode}
        onRun={handleRunCode}
      />
      <CodeOutput output={output} />
    </div>
  );
};