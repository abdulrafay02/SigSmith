import {GoogleGenAI} from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({apiKey}) : null;
