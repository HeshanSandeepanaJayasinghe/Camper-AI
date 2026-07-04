const GEMINI_API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  'AIzaSyBU1CYvaFr2B6FqMbJAcPzDPLhlTskPhCk';

export async function askGemini(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      return 'The AI assistant is not configured yet. Add a Gemini API key to your Expo environment.';
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
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
    
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      if (data.error) {
        console.error('Gemini API error payload:', data.error);
        return `Gemini API Error: ${data.error.message || 'Unknown API issue'}`;
      }
      return "I'm having trouble processing your query. Please try again.";
    }
  } catch (err) {
    console.error('Gemini request failed:', err);
    return 'Failed to reach the AI assistant. Please check your network.';
  }
}
