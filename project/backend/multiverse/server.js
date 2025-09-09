import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";

// Configure CORS
const allowedOrigins = [
  'https://arkhamarchives.netlify.app',  // Your Netlify domain
  'http://localhost:3000',               // Local development
  'https://arkhamarchives.com'           // Your custom domain (if any)
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', cors(corsOptions));

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
