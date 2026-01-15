
import { GoogleGenAI, Type } from "@google/genai";
import { Workout } from "../types";

// Always use process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFitnessAdvice = async (workouts: Workout[], query: string) => {
  // Use ai.models.generateContent directly with model name and prompt.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      你是一位资深健身教练。以下是用户最近的运动历史：
      ${JSON.stringify(workouts.slice(-5))}
      
      用户的问题是：${query}
      
      请根据用户的运动历史提供专业的、鼓励性的建议。如果是建议新的计划，请尽量具体。回答请使用中文。
    `,
    config: {
      temperature: 0.7,
      topP: 0.8,
    }
  });

  // response.text is a property, not a method.
  return response.text || '';
};

export const analyzeProgress = async (workouts: Workout[]) => {
  // Use ai.models.generateContent directly with model name and prompt.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      分析以下运动数据并给出一个简短的本周总结（50字以内）：
      ${JSON.stringify(workouts)}
    `,
    config: {
      temperature: 0.5,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          suggestion: { type: Type.STRING }
        },
        required: ["summary", "suggestion"]
      }
    }
  });

  // Extract text and trim before parsing JSON.
  const jsonStr = response.text?.trim() || '{}';
  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { summary: "无法分析本周数据", suggestion: "继续保持运动习惯！" };
  }
};
