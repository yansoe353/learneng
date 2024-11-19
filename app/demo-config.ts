import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

function getSystemPrompt() {
  let sysPrompt: string;
  sysPrompt = `
  # AI English Conversation Assistant Configuration

  ## Core Identity
  - Name: Winko.AI English Partner
  - Role: Natural English conversation practice assistant
  - Current time: ${new Date()}

  ## Conversation Guidelines
  1. Natural Communication Style
    - Use everyday English expressions
    - Maintain natural conversation flow
    - Avoid interrupting user's speech
    - Allow thinking time when needed

  2. Correction Approach
    - Prioritize conversation flow over immediate corrections
    - Collect minor errors for later discussion
    - Focus on 1-2 key improvements at a time
    - Use gentle correction phrases:
      * "That's a great point. Another way to express it..."
      * "I like how you explained that. You might also try..."

  3. Learning Support
    - Adapt language to user's proficiency level
    - Introduce vocabulary naturally within context
    - Provide grammar explanations only when requested
    - Encourage extended responses through follow-up questions

  4. Engagement Strategy
    - Maintain a patient and friendly attitude
    - Offer positive reinforcement
    - Expand on topics of user interest
    - Create a relaxed learning environment

  5. Practice Focus
    - Natural conversation skills
    - Pronunciation improvement
    - Grammar usage in context
    - Vocabulary expansion
    - Speaking confidence

  Remember: Prioritize maintaining a natural, enjoyable conversation while subtly supporting language improvement. Adapt your approach based on the user's comfort and skill level.
  `;

  sysPrompt = sysPrompt.replace(/"/g, '\"')
    .replace(/\n/g, '\n');

  return sysPrompt;
}

const selectedTools: SelectedTool[] = [
  {
    "temporaryTool": {
      "modelToolName": "speechAnalysis",
      "description": "Analyze user's speech patterns and language usage during the conversation",      
      "dynamicParameters": [
        {
          "name": "analysisData",
          "location": ParameterLocation.BODY,
          "schema": {
            "type": "object",
            "properties": {
              "userResponse": { 
                "type": "string", 
                "description": "The actual text of user's speech" 
              },
              "context": { 
                "type": "string", 
                "description": "The context or topic of the conversation" 
              },
              "analysis": {
                "type": "object",
                "properties": {
                  "expressionUsage": { 
                    "type": "string", 
                    "description": "Analysis of expressions and phrases used" 
                  },
                  "communicationStyle": { 
                    "type": "string", 
                    "description": "Analysis of communication effectiveness" 
                  }
                }
              }
            },
            "required": ["userResponse", "analysis"]
          },
          "required": true
        }
      ],
      "client": {}
    }
  },
  {
    "temporaryTool": {
      "modelToolName": "errorCorrection",
      "description": "Collect and provide improvements for language errors",
      "dynamicParameters": [
        {
          "name": "correctionData",
          "location": ParameterLocation.BODY,
          "schema": {
            "type": "object",
            "properties": {
              "errors": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "original": { 
                      "type": "string", 
                      "description": "Original expression used" 
                    },
                    "type": { 
                      "type": "string", 
                      "enum": ["grammar", "vocabulary", "expression"],
                      "description": "Type of error" 
                    },
                    "improvement": { 
                      "type": "string", 
                      "description": "Suggested improvement" 
                    },
                    "explanation": { 
                      "type": "string", 
                      "description": "Brief explanation of the improvement" 
                    }
                  }
                },
                "maxItems": 2,  // 限制为1-2个关键改进
                "description": "Collection of errors and their improvements"
              },
              "priority": { 
                "type": "string", 
                "description": "Which error should be addressed first" 
              }
            },
            "required": ["errors"]
          },
          "required": true
        }
      ],
      "client": {}
    }
  }
];

export const demoConfig: DemoConfig = {
  title: "Winko English Learning Assistant",
  overview: "Welcome to your personal English learning assistant. Practice speaking English naturally through conversation. Click 'Start Call' to begin your session.",
  callConfig: {
    systemPrompt: getSystemPrompt(),
    model: "fixie-ai/ultravox-70B",
    languageHint: "en",
    selectedTools: selectedTools,
    voice: "terrence",
    temperature: 0.4
  }
};

export default demoConfig;