import fetch from 'node-fetch';

const DEEPSEEK_API_KEY = "sk-074673a2fac04fc7802daafb8a132f55";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

async function testDeepSeekAPI() {
  try {
    console.log('🧪 Testing DeepSeek API connection...');
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Write a very short story about two friends meeting at a cafe. Keep it under 100 words.'
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
        stream: false
      })
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ API Error:', errorData);
      return;
    }

    const data = await response.json();
    const story = data.choices[0]?.message?.content;
    
    console.log('✅ API Test Success!');
    console.log('📖 Generated Story:');
    console.log('---');
    console.log(story);
    console.log('---');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDeepSeekAPI();
