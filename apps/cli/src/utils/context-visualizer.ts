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
    // Extract current focus concepts based on recent interactions
    const recentResponses = Object.values(context.responses).slice(-3);
    const focus = recentResponses.flatMap(r => r.analysis.keywords);

    // Calculate overall context strength
    const strength = this.calculateContextStrength(context);

    // Get most relevant connections
    const connections = this.getSignificantConnections(context._system.relationshipGraph);

    // Extract key insights
    const insights = this.extractKeyInsights(context);

    return {
      focus,
      strength,
      connections,
      insights
    };
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

    // Display key connections
    console.log(chalk.yellow('\n🔗 Key Connections:'));
    snapshot.connections.slice(0, 3).forEach(c => {
      console.log(`  ${chalk.blue(c.from)} ${chalk.dim('→')} ${chalk.blue(c.to)} (${c.weight.toFixed(2)})`);
    });

    // Display insights
    console.log(chalk.yellow('\n💡 Key Insights:'));
    snapshot.insights.slice(0, 2).forEach(i => console.log(`  ${chalk.green('•')} ${i}`));

    console.log(chalk.dim('─'.repeat(50)) + '\n');
  }

  private static calculateContextStrength(context: EnhancedProjectContext): number {
    const factors = [
      context.conceptual.vision.length > 0 ? 0.2 : 0,
      context.technical.stack.length > 0 ? 0.2 : 0,
      Object.keys(context.responses).length > 3 ? 0.2 : 0.1,
      context._system.relationshipGraph.edges.length > 5 ? 0.2 : 0.1,
      context._system.contextualHints.architecture.length > 0 ? 0.2 : 0
    ];

    return factors.reduce((sum, factor) => sum + factor, 0);
  }

  private static getSignificantConnections(graph: RelationshipGraph) {
    return graph.edges
      .sort((a, b) => b.weight - a.weight)
      .map(edge => ({
        from: edge.from,
        to: edge.to,
        weight: edge.weight
      }));
  }

  private static extractKeyInsights(context: EnhancedProjectContext): string[] {
    const insights: string[] = [];
    
    // Add technical insights
    if (context.technical.architecture.patterns.length > 0) {
      insights.push(`Using ${context.technical.architecture.patterns[0]} pattern`);
    }

    // Add conceptual insights
    if (context.conceptual.innovations.length > 0) {
      insights.push(`Innovation focus: ${context.conceptual.innovations[0]}`);
    }

    return insights;
  }

  private static generateStrengthBar(strength: number): string {
    const width = 20;
    const filledCount = Math.round(strength * width);
    const emptyCount = width - filledCount;
    
    return chalk.green('█'.repeat(filledCount)) + 
           chalk.gray('░'.repeat(emptyCount));
  }
} 