import axios from "axios";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

export interface AISummaryResult {
  title: string;
  topics: string[];
  summary: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

/* ------------------------------------------------------------------ */
/* Utilities */
/* ------------------------------------------------------------------ */

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Low-level Gemini REST call with retry + backoff
 */
const callGemini = async (
  prompt: string,
  retries = 3
): Promise<string> => {
  try {
    const response = await axios.post(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 20_000,
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("AIService: Empty response from Gemini");
    }

    return text;
  } catch (error: any) {
    // 🔁 Handle rate limiting (429)
    if (error.response?.status === 429 && retries > 0) {
      const delay = (4 - retries) * 1500; // backoff
      console.warn(
        `Gemini 429 hit. Retrying in ${delay}ms... (${retries} retries left)`
      );
      await sleep(delay);
      return callGemini(prompt, retries - 1);
    }

    throw error;
  }
};

/* ------------------------------------------------------------------ */
/* Main API */
/* ------------------------------------------------------------------ */

/**
 * Generates a structured summary from text chunks
 * using hierarchical summarization with Gemini (REST)
 */
export const generateStructuredSummary = async (
  chunks: string[]
): Promise<AISummaryResult> => {
  if (!chunks || chunks.length === 0) {
    throw new Error("AIService: No content provided for summarization");
  }

  /* Step 1: Summarize individual chunks */
  const partialSummaries: string[] = [];

  for (const chunk of chunks) {
    const prompt = `
Summarize the following content concisely while preserving key technical ideas:

${chunk}
    `.trim();

    const text = await callGemini(prompt);
    partialSummaries.push(text);

    // ⏱ Rate-limit protection between calls
    await sleep(800);
  }

  /* Step 2: Generate final structured summary */
  const mergedContent = partialSummaries.join("\n");

  const finalPrompt = `
You are a structured note-generation assistant.

From the content below:
- Generate a clear, concise title
- Extract the main topics as short phrases
- Write a clean, readable summary

Respond ONLY in valid JSON in this format:
{
  "title": "string",
  "topics": ["string"],
  "summary": "string"
}

Content:
${mergedContent}
  `.trim();

  const finalText = await callGemini(finalPrompt);

  // 🔒 Safe JSON extraction (Gemini may add extra text)
  const jsonMatch = finalText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("AIService: No JSON object found in Gemini response");
  }

  try {
    return JSON.parse(jsonMatch[0]) as AISummaryResult;
  } catch {
    throw new Error("AIService: Failed to parse Gemini response as JSON");
  }
};