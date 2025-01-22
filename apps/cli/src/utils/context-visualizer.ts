import { debug } from './debug';
import chalk from 'chalk';
import { EnhancedProjectContext, RelationshipGraph } from '../types_old/context';

interface ContextSnapshot {
  focus: string[];
  strength: number;
  connections: Array<{
    from: string;
    to: string;
    weight: number;
  }>;
  insights: string[];
}

export class ContextVisualizer {
  static async generateSnapshot(context: EnhancedProjectContext): Promise<ContextSnapshot> {
    try {
      // Extract keywords from insights if available, otherwise use defaults
      const focus = context.insights?.keywords || 
                   context.insights?.technicalPatterns || 
                   ['wish lists', 'AI-powered shopping', 'user experience'];

      // Calculate overall context strength based on available data
      const strength = this.calculateContextStrength(context);

      // Get connections from relationship graph if available
      const connections = context._system?.relationshipGraph ? 
        this.getSignificantConnections(context._system.relationshipGraph) :
        [];

      // Extract key insights from context
      const insights = this.extractKeyInsights(context);

      return {
        focus: Array.isArray(focus) ? focus : [],
        strength,
        connections,
        insights
      };
    } catch (error) {
      debug('ContextVisualizer', 'Error generating snapshot:', error);
      // Return default snapshot if error occurs
      return {
        focus: ['wish lists', 'AI-powered shopping', 'user experience'],
        strength: 0.5,
        connections: [],
        insights: []
      };
    }
  }

  private static calculateContextStrength(context: EnhancedProjectContext): number {
    try {
      let score = 0;
      let factors = 0;
      
      // Add points for each populated context field
      if (context.name) { score += 1; factors += 1; }
      if (context.description) { score += 1; factors += 1; }
      if (context.type) { score += 1; factors += 1; }
      if (context.goals?.length > 0) { score += 1; factors += 1; }
      if (Object.keys(context.insights || {}).length > 0) { score += 1; factors += 1; }
      if (Object.keys(context.structure || {}).length > 0) { score += 1; factors += 1; }
      
      return factors > 0 ? score / factors : 0.5;
    } catch (error) {
      debug('ContextVisualizer', 'Error calculating context strength:', error);
      return 0.5; // Return medium strength if calculation fails
    }
  }

  private static getSignificantConnections(graph: RelationshipGraph = {}): Array<{from: string; to: string; weight: number}> {
    try {
      const connections: Array<{from: string; to: string; weight: number}> = [];
      
      // Convert graph to array of connections
      Object.entries(graph).forEach(([from, targets]) => {
        Object.entries(targets).forEach(([to, weight]) => {
          if (weight > 0.5) { // Only include strong connections
            connections.push({ from, to, weight });
          }
        });
      });
      
      // Sort by weight and take top 5
      return connections
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5);
    } catch (error) {
      debug('ContextVisualizer', 'Error getting significant connections:', error);
      return [];
    }
  }

  private static extractKeyInsights(context: EnhancedProjectContext): string[] {
    try {
      const insights: string[] = [];
      
      // Add insights from various context properties
      if (context.type?.primaryType) {
        insights.push(`Project type: ${context.type.primaryType}`);
      }
      
      if (context.insights?.technicalPatterns?.length > 0) {
        insights.push(`Key technologies: ${context.insights.technicalPatterns.join(', ')}`);
      }
      
      if (context.goals?.length > 0) {
        insights.push(`Primary goals: ${context.goals.slice(0, 2).join(', ')}`);
      }
      
      return insights.length > 0 ? insights : ['AI-powered wish list management app'];
    } catch (error) {
      debug('ContextVisualizer', 'Error extracting key insights:', error);
      return ['AI-powered wish list management app'];
    }
  }

  static displaySnapshot(snapshot: ContextSnapshot): void {
    console.log('\n' + chalk.cyan('📊 Context Snapshot'));
    console.log(chalk.dim('─'.repeat(50)));

    // Display focus areas
    console.log(chalk.yellow('🎯 Current Focus:'));
    snapshot.focus.slice(0, 3).forEach(f => console.log(`  ${chalk.green('•')} ${f}`));

    // Display strength meter
    console.log(chalk.yellow('\n💪 Context Strength:'));
    const strengthBar = this.generateStrengthBar(snapshot.strength);
    console.log(`  ${strengthBar} ${Math.round(snapshot.strength * 100)}%`);

    // Display key insights
    if (snapshot.insights.length > 0) {
      console.log(chalk.yellow('\n💡 Key Insights:'));
      snapshot.insights.forEach(i => console.log(`  ${chalk.green('•')} ${i}`));
    }

    console.log(chalk.dim('─'.repeat(50)) + '\n');
  }

  private static generateStrengthBar(strength: number): string {
    const width = 20;
    const filled = Math.round(strength * width);
    const empty = width - filled;
    
    return chalk.green('█'.repeat(filled)) + 
           chalk.gray('░'.repeat(empty));
  }
}