import { NextRequest, NextResponse } from 'next/server';
import { tryParseJSON } from '@/lib/utils';
import { FlashcardData } from '@/lib/types';

const SYSTEM_PROMPT = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 12 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

interface ChatResponse {
  flashcards: FlashcardData[];
}

const DEFAULT_CHAT_RESPONSE: ChatResponse = {
  flashcards: [],
};

// Use the GEMINI_API_KEY from the environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

export async function POST(request: NextRequest) {
  const userInput = await request.text();

  try {
    // Send request to Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: `${SYSTEM_PROMPT}\n${userInput}` }] }  // Concatenate system prompt and user input
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Gemini API');
    }

    const responseData = await response.json();

    // Extract the content and check if the result contains valid JSON for flashcards
    const content = responseData.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const result: ChatResponse = tryParseJSON(content) ?? DEFAULT_CHAT_RESPONSE;

    // Return the flashcards as a JSON response
    return NextResponse.json(result.flashcards);

  } catch (error) {
    console.error('Error with Gemini API request:', error);
    return NextResponse.json({ error: 'Something went wrong with the request.' });
  }
}
