const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();

function handleGeminiResponse(data: any, status?: number): string {
  if (
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts[0]
  ) {
    return data.candidates[0].content.parts[0].text;
  }

  if (data.error) {
    console.error('Gemini API error payload:', data.error);
    const errorStatus = data.error.status;
    const errorMessage = data.error.message || 'Unknown API issue';

    if (
      status === 401 ||
      status === 403 ||
      errorStatus === 'UNAUTHENTICATED' ||
      errorStatus === 'PERMISSION_DENIED' ||
      errorMessage.includes('API key') ||
      errorMessage.includes('authentication')
    ) {
      return 'Gemini authentication failed. Please verify your API key in the Expo environment and make sure it is enabled for the Gemini API.';
    }

    const isInvalidKey =
      errorStatus === 'INVALID_ARGUMENT' ||
      errorMessage.includes('not found for API version') ||
      errorMessage.includes('not supported for generateContent');

    if (isInvalidKey) {
      return 'Gemini API key is invalid or deactivated. Please get a valid API key from Google AI Studio (https://aistudio.google.com/) and update your .env file with EXPO_PUBLIC_GEMINI_API_KEY="your_api_key".';
    }

    return `Gemini API Error: ${errorMessage}`;
  }

  return "I'm having trouble processing your query. Please try again.";
}

export async function askGemini(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      return 'The AI assistant is not configured yet. Add a Gemini API key to your Expo environment.';
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      systemInstruction: systemInstruction
        ? {
            parts: [
              {
                text: systemInstruction,
              },
            ],
          }
        : undefined,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return handleGeminiResponse(data, response.status);
  } catch (err) {
    console.error('Gemini request failed:', err);
    return 'Failed to reach the AI assistant. Please check your network.';
  }
}

export type ChatTurn = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export async function askGeminiChat(
  history: { from: 'assistant' | 'user'; text: string }[],
  systemInstruction?: string
): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      return 'The AI assistant is not configured yet. Add a Gemini API key to your Expo environment.';
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Ensure history starts with 'user' role turn (Gemini API validation requirement)
    const firstUserIndex = history.findIndex((msg) => msg.from === 'user');
    const validHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : history;

    // Map message history to Gemini API format: 'user' or 'model'
    const contents: ChatTurn[] = validHistory.map((message) => ({
      role: message.from === 'user' ? 'user' : 'model',
      parts: [{ text: message.text }],
    }));

    const body = {
      contents,
      systemInstruction: systemInstruction
        ? {
            parts: [
              {
                text: systemInstruction,
              },
            ],
          }
        : undefined,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return handleGeminiResponse(data, response.status);
  } catch (err) {
    console.error('Gemini request failed:', err);
    return 'Failed to reach the AI assistant. Please check your network.';
  }
}
