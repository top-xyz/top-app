import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import mermaid from 'mermaid';

interface FlowDiagramProps {
  definition: string;
  title?: string;
  interactive?: boolean;
  onNodeClick?: (nodeId: string) => void;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  definition,
  title,
  interactive = true,
  onNodeClick
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: theme === 'dark' ? 'dark' : 'default',
      flowchart: {
        curve: 'basis',
        padding: 20
      },
      themeVariables: {
        primaryColor: theme === 'dark' ? '#66A3FF' : '#0055FF',
        primaryTextColor: theme === 'dark' ? '#FFFFFF' : '#000000',
        primaryBorderColor: theme === 'dark' ? '#66A3FF' : '#0055FF',
        lineColor: theme === 'dark' ? '#4A5568' : '#A0AEC0',
        secondaryColor: theme === 'dark' ? '#FF66A3' : '#FF0055',
        tertiaryColor: theme === 'dark' ? '#A366FF' : '#5500FF'
      }
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render('diagram', definition);
        setSvgContent(svg);
      } catch (error) {
        console.error('Error rendering diagram:', error);
      }
    };

    renderDiagram();
  }, [definition, theme]);

  useEffect(() => {
    if (!interactive || !onNodeClick || !containerRef.current) return;

    const container = containerRef.current;
    const nodes = container.querySelectorAll('.node');

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const nodeId = node.id;
        onNodeClick(nodeId);
      });
    });

    return () => {
      nodes.forEach(node => {
        node.removeEventListener('click', () => {});
      });
    };
  }, [svgContent, interactive, onNodeClick]);

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
      
      <div 
        ref={containerRef}
        className={`p-4 bg-white dark:bg-gray-900 ${interactive ? 'cursor-pointer' : ''}`}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </motion.div>
  );
};

export default FlowDiagram; 