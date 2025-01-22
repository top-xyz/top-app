import { debug } from '../../utils/debug';
import { VertexAIClient } from '../client/vertex-ai';
import { ContextManager } from '../context/context-manager';
import { PromptManager } from '../prompts/prompt-manager';
import { Logger } from '../../utils/logger';
import { ProjectInitialContext } from '../../types/core/context';
import { FlowContext, FlowMetadata, EnhancedFlowContext } from '../../types/core/flow-context';
import { FlowState, InteractionPattern, ErgonomicProfile } from '../../types/core/flow';

export class FlowManager {
  private currentFlow: FlowContext | null = null;
  private flowHistory: FlowContext[] = [];
  private logger: Logger;

  constructor(
    private ai: VertexAIClient,
    private contextManager: ContextManager,
    private promptManager: PromptManager
  ) {
    this.logger = new Logger();
    debug('FlowManager', 'Initializing FlowManager');
  }

  async initializeFlow(context: ProjectInitialContext): Promise<FlowContext> {
    debug('FlowManager', 'Initializing flow state');

    // Generate initial flow state
    const flowState = await this.promptManager.generateFlowState(context);
    const patterns = await this.promptManager.generateInteractionPatterns(context);
    const ergonomics = await this.promptManager.generateErgonomicProfile(context);

    // Create flow context
    const flowContext: FlowContext = {
      name: `flow_${context.id || Date.now()}`,
      type: 'flow',
      description: 'Project flow state tracking',
      currentEnergy: flowState.intention.energy,
      momentum: 0,
      adaptations: [],
      metadata: {
        initialized: true,
        version: '1.0.0',
        stage: context.stage,
        currentState: flowState,
        patterns,
        ergonomics,
        transitions: {
          history: [],
          planned: []
        }
      },
      embeddings: {
        vision: [],
        technical: [],
        workflow: [],
        state: [],
        patterns: [],
        ergonomics: []
      }
    };

    // Store flow context
    this.currentFlow = flowContext;
    this.flowHistory.push({ ...flowContext });

    // Update project context with flow state
    await this.contextManager.updateContext({
      ...context,
      metadata: {
        ...context.metadata,
        flowState: flowState,
        flowPatterns: patterns,
        flowErgonomics: ergonomics
      }
    });

    return flowContext;
  }

  async transitionState(targetState: string): Promise<FlowContext> {
    if (!this.currentFlow) {
      throw new Error('Flow not initialized');
    }

    debug('FlowManager', 'Transitioning flow state', { targetState });

    // Generate transition plan
    const transition = await this.promptManager.generateFlowTransition(
      this.currentFlow.metadata.currentState,
      targetState
    );

    // Update flow state
    const updatedFlow: FlowContext = {
      ...this.currentFlow,
      currentEnergy: transition.energy,
      momentum: this.calculateMomentum(transition),
      metadata: {
        ...this.currentFlow.metadata,
        currentState: transition.to,
        transitions: {
          ...this.currentFlow.metadata.transitions,
          history: [
            ...this.currentFlow.metadata.transitions.history,
            {
              from: JSON.stringify(transition.from),
              to: JSON.stringify(transition.to),
              timestamp: new Date().toISOString(),
              energy: transition.energy
            }
          ]
        }
      }
    };

    // Store updated state
    this.currentFlow = updatedFlow;
    this.flowHistory.push({ ...updatedFlow });

    return updatedFlow;
  }

  async adaptFlow(trigger: string): Promise<void> {
    if (!this.currentFlow) {
      throw new Error('Flow not initialized');
    }

    debug('FlowManager', 'Adapting flow', { trigger });

    // Find matching pattern
    const pattern = this.currentFlow.metadata.patterns.find(p => 
      p.triggers.includes(trigger)
    );

    if (!pattern) {
      debug('FlowManager', 'No matching pattern found');
      return;
    }

    // Apply pattern adaptations
    const success = await this.applyAdaptations(pattern.adaptations);

    // Record adaptation
    this.currentFlow.adaptations.push({
      trigger,
      response: pattern.responses.join(', '),
      success,
      timestamp: new Date().toISOString()
    });

    // Update momentum based on adaptation success
    this.currentFlow.momentum = success ? 
      this.currentFlow.momentum + 0.1 : 
      this.currentFlow.momentum - 0.1;
  }

  private async applyAdaptations(adaptations: string[]): Promise<boolean> {
    try {
      for (const adaptation of adaptations) {
        await this.contextManager.updateContext({
          metadata: {
            flowAdaptation: adaptation,
            timestamp: new Date().toISOString()
          }
        });
      }
      return true;
    } catch (error) {
      debug('FlowManager', 'Error applying adaptations:', error);
      return false;
    }
  }

  private calculateMomentum(transition: any): number {
    const baseEnergy = transition.energy;
    const historyBonus = this.flowHistory.length * 0.05;
    const adaptationBonus = this.currentFlow?.adaptations.filter(a => a.success).length || 0 * 0.1;
    return Math.min(1, baseEnergy + historyBonus + adaptationBonus);
  }

  getCurrentFlow(): FlowContext | null {
    return this.currentFlow;
  }

  getFlowHistory(): FlowContext[] {
    return this.flowHistory;
  }

  async analyzeFlowState(): Promise<{
    energy: number;
    momentum: number;
    stability: number;
    nextStates: string[];
  }> {
    if (!this.currentFlow) {
      throw new Error('Flow not initialized');
    }

    const state = this.currentFlow.metadata.currentState;
    const momentum = this.currentFlow.momentum;
    const stability = state.manifestation.stability;

    // Get potential next states from patterns
    const nextStates = this.currentFlow.metadata.patterns
      .filter(p => p.triggers.some(t => this.canTrigger(t)))
      .flatMap(p => p.nextStates);

    return {
      energy: this.currentFlow.currentEnergy,
      momentum,
      stability,
      nextStates
    };
  }

  private canTrigger(trigger: string): boolean {
    if (!this.currentFlow) return false;

    const recentAdaptations = this.currentFlow.adaptations
      .slice(-5)
      .filter(a => a.trigger === trigger);

    // Avoid repeated triggers in short succession
    if (recentAdaptations.length > 2) return false;

    // Check if we have enough energy for the trigger
    return this.currentFlow.currentEnergy >= 0.3;
  }
}
