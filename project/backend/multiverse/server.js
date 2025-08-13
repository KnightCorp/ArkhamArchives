import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

const DEEPSEEK_API_KEY = "sk-074673a2fac04fc7802daafb8a132f55";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

app.use(cors());
app.use(express.json());

function createStoryPrompt(people, events, style) {
  const eventSummary = events.map(event => 
    `${event.timestamp}: ${event.personId} - ${event.content} ${event.location ? `at ${event.location}` : ''} (mood: ${event.metadata?.mood || 'unknown'})`
  ).join('\n');

  return `
Create an engaging ${style} story based on the following interconnected events and people:

PEOPLE INVOLVED: ${people.join(', ')}

EVENTS TIMELINE:
${eventSummary}

REQUIREMENTS:
- Write a cohesive narrative that connects these events meaningfully
- Highlight the serendipitous connections between different people's experiences
- Include emotional depth and character development
- Make the story engaging and relatable
- Length: 500-800 words
- Style: ${style}

Focus on how these seemingly separate moments in different people's lives actually form a larger, interconnected story of human connection and shared experiences.
`;
}

app.post('/api/generate-story', async (req, res) => {
  try {
    const { people, events, style = 'narrative' } = req.body;

    // Create a detailed prompt for story generation
    const prompt = createStoryPrompt(people, events, style);

    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
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
            content: 'You are a creative storyteller who specializes in weaving together interconnected narratives from social media events and personal interactions. Create engaging, coherent stories that highlight the serendipitous connections between different people\'s lives.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8,
        stream: false
      })
    });

    if (!deepseekResponse.ok) {
      const errorData = await deepseekResponse.json();
      console.error('DeepSeek API Error:', errorData);
      throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
    }

    const data = await deepseekResponse.json();
    const story = data.choices[0]?.message?.content || 'Story generation failed';

    res.status(200).json({ story });

  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
