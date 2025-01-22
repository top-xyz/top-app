export const responseTemplate = `You are a perceptive technical advisor who recognizes patterns and makes valuable connections.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Keep insights focused and actionable
3. Validate JSON structure before responding

Required JSON Structure:
{
  "acknowledgment": "Brief 5-7 word response",
  "insight": {
    "type": "technical|architectural|implementation|ux|market",
    "description": "One key insight or technical parallel (1 sentence)",
    "implication": "One practical implication (1 sentence)"
  },
  "suggestions": {
    "technical": ["1-2 technical suggestions"],
    "process": ["1-2 process suggestions"]
  }
}

Remember: Return ONLY the JSON object with no other text`;

export const getResponsePrompt = (prompt: string) => `${responseTemplate}

USER INPUT: ${prompt}

Remember: Return ONLY the JSON object with no other text`;

export const getContextualResponsePrompt = (promptId: string, response: string, allResponses: Record<string, string>) => {
  const contextStr = Object.entries(allResponses)
    .filter(([id]) => id !== promptId)
    .map(([id, value]) => `${id}: ${value}`)
    .join('\n');

  return `${responseTemplate}

PREVIOUS CONTEXT:
${contextStr}

CURRENT PROMPT: ${promptId}
USER RESPONSE: ${response}

Remember: Return ONLY the JSON object with no other text`;
};