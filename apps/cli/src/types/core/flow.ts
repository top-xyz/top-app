export interface FlowState {
  intention: {
    essence: string;
    vision: string;
    constraints: string[];
    energy: number;
  };
  conversation: {
    direction: string;
    understanding: string[];
    transformation: string[];
  };
  manifestation: {
    form: string;
    structure: string[];
    stability: number;
  };
  momentum: {
    direction: string;
    force: number;
    adaptation: string[];
  };
}

export interface InteractionPattern {
  type: 'creation' | 'refinement' | 'transformation' | 'completion';
  triggers: string[];
  responses: string[];
  adaptations: string[];
  nextStates: string[];
}

export interface FlowTransition {
  from: FlowState;
  to: FlowState;
  pattern: InteractionPattern;
  energy: number;
}

export interface ErgonomicProfile {
  presence: {
    nature: {
      presence: string;
      power: string;
      complexity: string;
    };
    flow: {
      learning: string;
      mastery: string;
      rhythm: string;
    };
  };
  balance: {
    harmony: {
      simplicity: string;
      capability: string;
      flexibility: string;
    };
    adaptation: {
      context: string;
      response: string;
      evolution: string;
    };
  };
}
