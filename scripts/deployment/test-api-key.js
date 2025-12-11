// Quick API Key Test
// Run this in your browser console or as a test script

const testApiKey = async () => {
  const apiKey = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Hello! Please respond with "API key is working!" if you can see this message.',
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 50,
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key Test Successful!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
      return true;
    } else {
      console.error(
        '❌ API Key Test Failed:',
        response.status,
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error('❌ API Key Test Error:', error);
    return false;
  }
};

// Run the test
testApiKey();
