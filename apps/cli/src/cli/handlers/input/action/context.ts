import { debug } from '../../../../utils/debug';
import { InteractiveManager } from '../interactive';
import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import { spinner } from '../../../../utils/spinner';
import { EnhancedProjectContext, SystemContext, ProjectContext } from '../../../../types/core/context';
import { getInsightsPrompt } from '../../../../core/prompts/templates/insights';
import { getContextualResponsePrompt } from '../../../../core/prompts/templates/response';

interface ConversationContext {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  detectedContexts: Array<{
    name: string;
    relevance: number;
    type: 'project' | 'conversation' | 'insight';
    context?: EnhancedProjectContext;
  }>;
  insights: SystemContext['insights'];
  currentContext?: EnhancedProjectContext;
  embeddings?: {
    conversation: number[];
    lastGenerated: string;
  };
}

const WELCOME_TEXT = chalk.cyan('\n🔥 entering flow state - your contexts await\n') +
chalk.dim(`
Recent contexts:
loading...

Start chatting about your creations, or try:
  projects              list all projects
  context [project]     explore a specific project
  help                  show more commands
`);

export async function handleContextList(manager: InteractiveManager): Promise<boolean> {
  try {
    console.log(WELCOME_TEXT);
    
    // Initialize conversation context
    const conversationContext: ConversationContext = {
      messages: [],
      detectedContexts: [],
      insights: {
        technicalPatterns: [],
        userNeeds: [],
        challenges: [],
        opportunities: []
      }
    };

    // Load and display recent contexts
    spinner.start('thought');
    const contexts = await manager.contextManager.listContexts();
    spinner.stop();
    
    // Clear previous welcome and show with contexts
    console.clear();
    console.log(chalk.cyan('\n🔥 entering flow state - your contexts await\n'));
    console.log(chalk.dim('Recent contexts:'));
    contexts.slice(0, 3).forEach(ctx => {
      console.log(chalk.cyan(`• ${ctx.name}`));
      if (ctx.description) {
        console.log(chalk.dim(`  ${ctx.description.split('\n')[0]}`));
      }
    });
    console.log(chalk.dim('\nStart chatting about your creations, or try:'));
    console.log(chalk.dim('  projects              list all projects'));
    console.log(chalk.dim('  context [project]     explore a specific project'));
    console.log(chalk.dim('  help                  show more commands\n'));

    while (true) {
      const query = await input({ message: '→' });
      if (!query) continue;
      
      const cmd = query.trim().toLowerCase();
      
      if (cmd === 'exit' || cmd === 'quit') {
        console.log(chalk.dim('\nleaving flow state...'));
        break;
      }

      spinner.start('thought');

      if (await handleUtilityCommand(cmd, manager, conversationContext)) {
        continue;
      }

      // Add user message to context
      conversationContext.messages.push({
        role: 'user',
        content: query,
        timestamp: new Date().toISOString()
      });

      // Update conversation embeddings
      const conversationText = conversationContext.messages
        .map(m => m.content)
        .join('\n');
      conversationContext.embeddings = {
        conversation: await manager.ai.generateEmbeddings(conversationText),
        lastGenerated: new Date().toISOString()
      };

      // Find relevant project contexts
      const relevantContexts = await manager.contextManager.findRelevantContexts(
        conversationText,
        0.5
      );

      // Update detected contexts with full context data
      conversationContext.detectedContexts = await Promise.all(
        relevantContexts.map(async ctx => ({
          name: ctx.name,
          relevance: ctx._system?.similarity || 0,
          type: 'project',
          context: ctx
        }))
      );

      // Generate insights from conversation using templates
      const insightsPrompt = getInsightsPrompt(
        conversationText,
        relevantContexts.map(ctx => ({
          name: ctx.name,
          description: ctx.description,
          insights: ctx.insights
        }))
      );

      const insightsResponse = await manager.ai.generateContent({
        prompt: insightsPrompt,
        type: 'insights'
      });

      // Parse and update insights
      try {
        const newInsights = JSON.parse(insightsResponse);
        Object.entries(newInsights).forEach(([key, values]) => {
          if (!conversationContext.insights[key]) {
            conversationContext.insights[key] = [];
          }
          conversationContext.insights[key] = [
            ...new Set([...conversationContext.insights[key], ...(values as string[])])
          ];
        });
      } catch (e) {
        debug('handleContextList', 'Failed to parse insights:', e);
      }

      // Generate contextual response using templates
      const responsePrompt = getContextualResponsePrompt(
        conversationText,
        conversationContext.messages,
        relevantContexts,
        conversationContext.insights
      );

      const response = await manager.ai.generateContent({
        prompt: responsePrompt,
        type: 'conversation'
      });

      // Add assistant response to context
      conversationContext.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      });

      // Update or create conversation context
      if (!conversationContext.currentContext) {
        conversationContext.currentContext = {
          name: 'conversation-' + new Date().toISOString(),
          description: conversationText,
          insights: conversationContext.insights,
          _system: {
            embeddings: conversationContext.embeddings,
            metadata: {
              type: 'conversation',
              initialized: new Date().toISOString(),
              stage: 'ongoing'
            }
          }
        };
      } else {
        conversationContext.currentContext.description = conversationText;
        conversationContext.currentContext.insights = conversationContext.insights;
        conversationContext.currentContext._system = {
          ...conversationContext.currentContext._system,
          embeddings: conversationContext.embeddings,
          metadata: {
            ...conversationContext.currentContext._system?.metadata,
            lastUpdated: new Date().toISOString()
          }
        };
      }

      spinner.stop();
      console.log(chalk.dim('\n' + response + '\n'));

      // Show context evolution hints
      const stronglyRelevant = conversationContext.detectedContexts
        .filter(ctx => ctx.relevance > 0.8);
      
      if (stronglyRelevant.length > 0) {
        const ctx = stronglyRelevant[0];
        console.log(
          chalk.dim(`Tip: This conversation seems closely related to '${ctx.name}'. Use 'context ${ctx.name}' to explore deeper.`)
        );
        
        // If we have new insights relevant to the project, suggest updating it
        const newInsightsCount = Object.values(conversationContext.insights)
          .flat()
          .filter(insight => 
            !ctx.context?.insights?.[Object.keys(conversationContext.insights)[0]]?.includes(insight)
          ).length;
          
        if (newInsightsCount > 0) {
          console.log(
            chalk.dim(`💡 Found ${newInsightsCount} new insights that could enhance '${ctx.name}'`)
          );
        }
      }
    }

    // Before exiting, save valuable conversation context if it evolved enough
    if (conversationContext.currentContext && 
        Object.values(conversationContext.insights).some(arr => arr.length > 0)) {
      await manager.contextManager.addContext(conversationContext.currentContext);
    }

    return true;
  } catch (error) {
    spinner.stop();
    debug('handleContextList', 'Error:', error);
    return false;
  }
}

async function handleUtilityCommand(
  cmd: string, 
  manager: InteractiveManager,
  conversationContext: ConversationContext
): Promise<boolean> {
  if (cmd === 'help') {
    spinner.stop();
    console.log(chalk.dim(`
Available commands:
  projects              list all projects
  context [project]     explore a specific project
  insights             show insights from conversation
  related              show related projects
  help                 show this help message
Or just chat naturally about your projects and ideas...
`));
    return true;
  }

  if (cmd === 'projects') {
    const contexts = await manager.contextManager.listContexts();
    spinner.stop();
    if (contexts.length === 0) {
      console.log(chalk.dim('no projects found yet'));
    } else {
      console.log(chalk.dim('\nprojects in your reality:'));
      contexts.forEach(ctx => {
        console.log(chalk.cyan(`• ${ctx.name}`));
        if (ctx.description) {
          console.log(chalk.dim(`  ${ctx.description.split('\n')[0]}`));
        }
      });
    }
    return true;
  }

  if (cmd === 'insights') {
    spinner.stop();
    if (Object.keys(conversationContext.insights).length === 0) {
      console.log(chalk.dim('no insights gathered yet from our conversation'));
    } else {
      console.log(chalk.dim('\ninsights from our conversation:'));
      Object.entries(conversationContext.insights).forEach(([key, values]) => {
        if (values && values.length > 0) {
          console.log(chalk.cyan(`\n${key}:`));
          values.forEach(v => console.log(chalk.dim(`• ${v}`)));
        }
      });
    }
    return true;
  }

  if (cmd === 'related') {
    spinner.stop();
    const relevant = conversationContext.detectedContexts
      .filter(ctx => ctx.relevance > 0.6)
      .sort((a, b) => b.relevance - a.relevance);
    
    if (relevant.length === 0) {
      console.log(chalk.dim('no strongly related projects found yet'));
    } else {
      console.log(chalk.dim('\nrelated projects:'));
      relevant.forEach(ctx => {
        console.log(chalk.cyan(`• ${ctx.name} (${Math.round(ctx.relevance * 100)}% relevant)`));
      });
    }
    return true;
  }

  if (cmd.startsWith('context')) {
    const projectName = cmd.split(' ')[1];
    if (!projectName) {
      spinner.stop();
      console.log(chalk.yellow('usage: context <project-name>'));
      return true;
    }

    const context = await manager.contextManager.getContext(projectName);
    if (!context) {
      spinner.stop();
      console.log(chalk.yellow(`project '${projectName}' not found`));
      return true;
    }

    spinner.stop();
    console.log(chalk.dim('\nproject context:'));
    console.log(chalk.cyan(`# ${context.name}`));
    console.log(chalk.dim(context.description));
    if (context.insights) {
      Object.entries(context.insights).forEach(([key, values]) => {
        if (values && values.length > 0) {
          console.log(chalk.cyan(`\n## ${key}`));
          values.forEach(v => console.log(chalk.dim(`• ${v}`)));
        }
      });
    }
    return true;
  }

  return false;
}
