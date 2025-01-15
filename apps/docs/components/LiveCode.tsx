import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface LiveCodeProps {
  code: string;
  language?: string;
  title?: string;
  interactive?: boolean;
  onRun?: (code: string) => void;
  output?: string;
}

export const LiveCode: React.FC<LiveCodeProps> = ({
  code: initialCode,
  language = 'typescript',
  title,
  interactive = true,
  onRun,
  output: initialOutput = ''
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(initialOutput);
  const [isRunning, setIsRunning] = useState(false);
  const { theme } = useTheme();

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  const handleRun = async () => {
    if (!onRun || isRunning) return;
    
    setIsRunning(true);
    try {
      await onRun(code);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div
      className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        </div>
      )}
      
      <div className="relative">
        {interactive ? (
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
            spellCheck="false"
          />
        ) : (
          <SyntaxHighlighter
            language={language}
            style={theme === 'dark' ? tomorrow : prism}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: theme === 'dark' ? '#1a1a1a' : '#ffffff'
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>

      {interactive && (
        <>
          <div className="flex justify-end px-4 py-2 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`px-4 py-1 text-sm font-medium rounded-md ${
                isRunning
                  ? 'bg-gray-400 text-gray-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isRunning ? 'Running...' : 'Run'}
            </button>
          </div>

          {output && (
            <div className="p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default LiveCode; 