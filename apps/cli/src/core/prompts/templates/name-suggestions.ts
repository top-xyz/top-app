export const getNameSuggestionsPrompt = (description: string) => `Based on this project description: "${description}", suggest 4-5 fun, memorable project names.
Rules for names:
- Must be single words, 3-6 letters long
- Should be cute, fun, or playful
- Can be made-up words that sound good
- Should subtly relate to the project's purpose
- Avoid technical terms or obvious descriptions

Format the response as a JSON array of objects with 'name' and 'reason' properties.
Example: [{"name": "zoop", "reason": "Playful word suggesting quick, fun interactions"}]

Reference style: Names like 'squish', 'top', 'sine', 'helios', 'peek', 'drib'

IMPORTANT: Return ONLY the JSON array, no other text or formatting.`; 