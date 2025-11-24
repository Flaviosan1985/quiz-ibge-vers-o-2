import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Helper to safely get API key from Vite env or Node process
const getApiKey = (): string | undefined => {
  try {
    // Check for Vite environment variable (Standard for local React dev)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore error
  }

  try {
    // Check for Node/Process environment variable (Fallback/Production)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environment variable access failed.");
  }
  return undefined;
};

export const explainAnswerWithAI = async (
  question: string,
  correctOption: string,
  userSelectedOption: string
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key is missing. AI features will be disabled.");
    return "O tutor IA está indisponível no momento (Chave de API não configurada).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Você é um tutor especialista do IBGE.
      A pergunta foi: "${question}"
      A resposta correta é: "${correctOption}"
      O usuário escolheu: "${userSelectedOption}"
      
      Explique de forma concisa (máximo 2 frases) por que a resposta correta é a correta e, se o usuário errou, por que a escolha dele estava incorreta. Seja didático e encorajador.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Não foi possível gerar uma explicação no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com o tutor IA.";
  }
};

export const generateNewQuestions = async (): Promise<Question[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Gere 5 novas perguntas de múltipla escolha sobre o IBGE (geografia do Brasil, história do IBGE, estatística básica, pesquisas atuais). Nível médio/difícil.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              q: { type: Type.STRING, description: "O enunciado da pergunta" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 opções de resposta" 
              },
              answer: { 
                type: Type.INTEGER, 
                description: "O índice (0-3) da resposta correta" 
              }
            },
            required: ["q", "options", "answer"]
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as Question[];
    }
    return [];

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};