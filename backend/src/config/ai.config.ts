import { GEMINI_API_KEY } from "./env.config";
import {GoogleGenAI} from '@google/genai'


// import { OPENROUTER_API_KEY } from './env.config';
// import OpenAI from 'openai';

// export const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: OPENROUTER_API_KEY as string,
// });

export const geminiModel = new GoogleGenAI({apiKey: GEMINI_API_KEY as string});

